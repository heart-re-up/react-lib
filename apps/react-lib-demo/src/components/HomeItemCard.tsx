import { Card } from "@radix-ui/themes";
import { Link } from "react-router";
import type { MenuRoute } from "@/menu";

interface HomeItemCardProps {
  item: MenuRoute;
}

const categoryColors: Record<string, string> = {
  temporal: "bg-blue-100 text-blue-800",
  state: "bg-green-100 text-green-800",
  helper: "bg-yellow-100 text-yellow-800",
  event: "bg-red-100 text-red-800",
  focus: "bg-purple-100 text-purple-800",
  window: "bg-indigo-100 text-indigo-800",
  communication: "bg-pink-100 text-pink-800",
};

const categoryLabels: Record<string, string> = {
  temporal: "시간",
  state: "상태",
  helper: "유틸",
  event: "이벤트",
  focus: "포커스",
  window: "윈도우",
  communication: "통신",
};

export default function HomeItemCard({ item }: HomeItemCardProps) {
  return (
    <Link to={item.path} className="group">
      <Card className="p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="flex flex-wrap gap-1 mb-2">
          {item.category.map((cat) => (
            <span
              key={cat}
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                categoryColors[cat] || "bg-gray-100 text-gray-800"
              }`}
            >
              {categoryLabels[cat] || cat}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
          {item.title}
        </h3>
        <p className="text-gray-600 text-xs">{item.description}</p>
      </Card>
    </Link>
  );
}
