import { useParams } from "react-router-dom";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold">Movie Detail</h1>
      <p>Movie ID: {id}</p>
    </div>
  );
}
