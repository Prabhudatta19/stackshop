type Props = {
  params: { slug: string };
};

export default function PublicStorePage({ params }: Props) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to {params.slug}'s Store</h1>
      <p className="text-gray-700">Scan QR and collect points here.</p>
    </div>
  );
}
