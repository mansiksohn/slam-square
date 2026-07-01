import { redirect } from 'next/navigation';

interface FlagDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FlagDetailPage({ params }: FlagDetailPageProps) {
  const { id } = await params;
  
  // 메인 광장으로 이동하면서 쿼리 매개변수로 focus 깃발 ID 전달
  redirect(`/?focus=${id}`);
}
