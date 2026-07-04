'use client';

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import * as d3 from 'd3';
import type {
  Flag,
  FlagConnection,
  GraphNode,
  GraphLink,
} from '@/types';
import { calcRadius } from '@/hooks/useStore';
import styles from './SquareGraph.module.css';

interface SquareGraphProps {
  flags: Flag[];
  connections: FlagConnection[];
  supportedIds: Set<string>;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  focusNodeId?: string | null; // 공유 링크 진입 시 특정 노드 포커스
}

const LINK_DISTANCE = 130;
const CHARGE_STRENGTH = -220;

export default function SquareGraph({
  flags,
  connections,
  supportedIds,
  selectedNodeId,
  onSelectNode,
  focusNodeId,
}: SquareGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // nodes & links를 메모이제이션
  const { nodes, links } = useMemo<{ nodes: GraphNode[]; links: GraphLink[] }>(() => {
    const nodes: GraphNode[] = flags.map(f => ({
      ...f,
      radius: calcRadius(f.supporterCount),
    }));

    const links: GraphLink[] = connections.map(c => ({
      source: c.flagAId,
      target: c.flagBId,
      connectionType: c.connectionType,
      isUserSupported:
        supportedIds.has(c.flagAId) && supportedIds.has(c.flagBId),
    }));

    return { nodes, links };
  }, [flags, connections, supportedIds]);

  // 줌인/줌아웃 핸들러
  const zoomTo = useCallback(
    (nodeId: string | null) => {
      const svg = svgRef.current;
      const zoom = zoomRef.current;
      if (!svg || !zoom) return;

      const svgEl = d3.select(svg);

      if (!nodeId) {
        // 전체 뷰로 복귀
        svgEl.transition().duration(600).call(
          zoom.transform,
          d3.zoomIdentity.translate(svg.clientWidth / 2, svg.clientHeight / 2).scale(0.9)
        );
        return;
      }

      const node = simulationRef.current
        ?.nodes()
        .find(n => n.id === nodeId);
      if (!node || node.x == null || node.y == null) return;

      const scale = 1.8;
      const tx = svg.clientWidth / 2 - scale * node.x;
      const ty = svg.clientHeight / 2 - scale * node.y;

      svgEl.transition().duration(600).call(
        zoom.transform,
        d3.zoomIdentity.translate(tx, ty).scale(scale)
      );
    },
    []
  );

  useEffect(() => {
    if (selectedNodeId) zoomTo(selectedNodeId);
    else zoomTo(null);
  }, [selectedNodeId, zoomTo]);

  // 공유 링크 진입 시 자동 포커스
  useEffect(() => {
    if (focusNodeId) {
      setTimeout(() => zoomTo(focusNodeId), 800);
    }
  }, [focusNodeId, zoomTo]);

  // d3 시뮬레이션 초기화
  useEffect(() => {
    const svg = svgRef.current;
    const g = gRef.current;
    if (!svg || !g) return;

    const width = svg.clientWidth || 800;
    const height = svg.clientHeight || 600;

    // 기존 시뮬레이션 정리
    simulationRef.current?.stop();

    // 노드 복사 (d3가 직접 수정하므로)
    const simNodes: GraphNode[] = nodes.map(n => ({ ...n }));
    const simLinks: GraphLink[] = links.map(l => ({
      ...l,
      source: l.source as string,
      target: l.target as string,
    }));

    // 시뮬레이션 생성
    const simulation = d3
      .forceSimulation<GraphNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(simLinks)
          .id(d => d.id)
          .distance(LINK_DISTANCE)
          .strength(0.6)
      )
      .force('charge', d3.forceManyBody().strength(CHARGE_STRENGTH))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide<GraphNode>().radius(d => d.radius + 12).strength(0.8)
      )
      .alphaDecay(0.025);

    simulationRef.current = simulation;

    // SVG 선택
    const svgSel = d3.select(svg);
    const gSel = d3.select(g);

    // 줌 동작
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', event => {
        gSel.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svgSel.call(zoom);

    // 초기 뷰 설정
    svgSel.call(
      zoom.transform,
      d3.zoomIdentity.translate(0, 0).scale(1)
    );

    // 배경 클릭 → 선택 해제
    svgSel.on('click', (event) => {
      if (event.target === svg) onSelectNode(null);
    });

    // ── 연결선 렌더링 ──────────────────────────────────────
    const linkGroup = gSel.select<SVGGElement>('.links');
    linkGroup.selectAll('*').remove();

    const linkEls = linkGroup
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(simLinks)
      .join('line')
      .attr('class', styles.link)
      .attr('stroke-dasharray', d =>
        d.isUserSupported ? 'none' : '5,5'
      )
      .attr('stroke', d =>
        d.isUserSupported
          ? 'rgba(69, 85, 129, 0.55)'
          : 'rgba(69, 85, 129, 0.20)'
      )
      .attr('stroke-width', d => (d.isUserSupported ? 2 : 1.5));

    // ── 노드 렌더링 ────────────────────────────────────────
    const nodeGroup = gSel.select<SVGGElement>('.nodes');
    nodeGroup.selectAll('*').remove();

    const nodeEls = nodeGroup
      .selectAll<SVGGElement, GraphNode>('g.node')
      .data(simNodes, d => d.id)
      .join('g')
      .attr('class', `node ${styles.nodeGroup}`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectNode(d.id === selectedNodeId ? null : d.id);
      });

    // 외부 광원 링 (글로우)
    nodeEls
      .append('circle')
      .attr('r', d => d.radius + 8)
      .attr('fill', d => d.color)
      .attr('opacity', 0.12)
      .attr('class', styles.nodeGlow);

    // 유리 외곽선
    nodeEls
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('fill-opacity', 0.85)
      .attr('stroke', 'rgba(255,255,255,0.55)')
      .attr('stroke-width', 2)
      .attr('class', styles.nodeCircle)
      .attr('filter', 'url(#nodeBlur)');

    // 이모지 (중앙)
    nodeEls
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', d => Math.max(14, d.radius * 0.7))
      .attr('user-select', 'none')
      .text(d => d.emoji2 ? `${d.emoji1}${d.emoji2}` : d.emoji1);

    // 지지자 수 배지
    nodeEls
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('y', d => d.radius + 18)
      .attr('font-size', '11')
      .attr('font-family', 'Quicksand, sans-serif')
      .attr('font-weight', '600')
      .attr('fill', 'rgba(11, 28, 48, 0.6)')
      .attr('class', styles.nodeCount)
      .text(d => d.supporterCount.toLocaleString());

    // 드래그
    const drag = d3
      .drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeEls.call(drag);

    // ── 깃발 오버레이 (선택 노드에만 표시) ────────────────────
    // 노드 <g> 하위에 미리 생성해두고 opacity로 show/hide
    nodeEls.each(function(d) {
      const g = d3.select(this);
      const r = d.radius;
      const POLE_H  = 50;    // 깃대가 원 위로 올라가는 높이
      const CLOTH_W = 44;    // 깃발 천 가로
      const CLOTH_H = 28;    // 깃발 천 세로
      const poleTipY = -(r + POLE_H);

      const overlay = g.append('g')
        .attr('class', 'flagOverlay flag-overlay-group')
        .style('opacity', '0');

      // 깃대 세로선
      overlay.append('line')
        .attr('x1', 0).attr('y1', -r)
        .attr('x2', 0).attr('y2', poleTipY)
        .attr('stroke', '#c5c6d0')
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');

      // 깃대 하단 받침
      overlay.append('line')
        .attr('x1', -5).attr('y1', -r)
        .attr('x2',  5).attr('y2', -r)
        .attr('stroke', '#c5c6d0')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round');

      // 깃발 천 — 두 계층으로 분리
      // ① 위치용 <g>: SVG transform attribute로 pole tip에 배치
      //    (CSS transform과 충돌하지 않도록 별도 요소에 위치 지정)
      // ② 애니메이션용 <g>: CSS class만 가짐 (transform-origin = left center)
      const clothPos = overlay.append('g')
        .attr('transform', `translate(0, ${poleTipY})`);

      const clothG = clothPos.append('g')
        .attr('class', 'flag-cloth-wave')
        .style('transform-origin', `0px ${CLOTH_H / 2}px`);

      // 천 배경 (깃발 색 + 연한 배경)
      clothG.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', CLOTH_W).attr('height', CLOTH_H)
        .attr('rx', 2).attr('ry', 4)
        .attr('fill', d.color)
        .attr('fill-opacity', 0.20)
        .attr('stroke', d.color)
        .attr('stroke-opacity', 0.55)
        .attr('stroke-width', 1);

      // 이모지
      clothG.append('text')
        .attr('x', CLOTH_W / 2)
        .attr('y', CLOTH_H / 2 + 1)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '15')
        .attr('user-select', 'none')
        .text(d.emoji2 ? `${d.emoji1}${d.emoji2}` : d.emoji1);
    });


    // 틱 업데이트
    simulation.on('tick', () => {
      linkEls
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0);

      nodeEls.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);

      // 선택된 노드 처리
      nodeEls.select<SVGCircleElement>(`.${styles.nodeCircle}`)
        .attr('stroke', d =>
          d.id === selectedNodeId
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(255,255,255,0.55)'
        )
        .attr('stroke-width', d => d.id === selectedNodeId ? 3 : 2);

      nodeEls.select<SVGCircleElement>(`.${styles.nodeGlow}`)
        .attr('opacity', d =>
          d.id === selectedNodeId ? 0.28 : 0.12
        );

      // 선택된 노드가 있을 때 비선택 노드 흐리게
      if (selectedNodeId) {
        const selectedNode = simNodes.find(n => n.id === selectedNodeId);
        const connectedIds = new Set<string>([selectedNodeId]);

        if (selectedNode) {
          simLinks.forEach(l => {
            const srcId = (l.source as GraphNode).id;
            const tgtId = (l.target as GraphNode).id;
            if (srcId === selectedNodeId) connectedIds.add(tgtId);
            if (tgtId === selectedNodeId) connectedIds.add(srcId);
          });
        }

        nodeEls.attr('opacity', d =>
          connectedIds.has(d.id) ? 1 : 0.25
        );

        linkEls.attr('opacity', d => {
          const srcId = (d.source as GraphNode).id;
          const tgtId = (d.target as GraphNode).id;
          return srcId === selectedNodeId || tgtId === selectedNodeId
            ? 1
            : 0.1;
        });
      } else {
        nodeEls.attr('opacity', 1);
        linkEls.attr('opacity', 1);
      }
    });

    return () => {
      simulation.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links]);

  // 선택된 노드의 깃발 오버레이 show/hide
  // 별도 useEffect — 시뮬레이션이 정지된 후에도 정확히 작동
  useEffect(() => {
    const g = gRef.current;
    if (!g) return;

    d3.select(g)
      .selectAll<SVGGElement, GraphNode>('g.node')
      .each(function(d) {
        d3.select(this)
          .select('.flagOverlay')
          .style('opacity', d.id === selectedNodeId ? '1' : '0');
      });
  }, [selectedNodeId]);

  return (
    <svg
      ref={svgRef}
      className={styles.svg}
      role="img"
      aria-label="Slam Square 깃발 광장 그래프"
    >
      {/* SVG 필터 정의 */}
      <defs>
        <filter id="nodeBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g ref={gRef}>
        <g className="links" />
        <g className="nodes" />
      </g>
    </svg>
  );
}
