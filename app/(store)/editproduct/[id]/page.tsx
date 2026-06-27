import EditProduct from "@/components/EditProducts";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <EditProduct productId={id} />
    </div>
  );
}