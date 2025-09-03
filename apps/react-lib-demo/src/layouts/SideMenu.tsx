import { cn } from "@/lib/utils";
import { menuRoutes } from "@/menu";
import { TextField } from "@radix-ui/themes";
import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";

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

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const filteredRoutes = useMemo(() => {
    if (!searchTerm.trim()) return menuRoutes;

    return menuRoutes.filter(
      (route) =>
        route.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (route.description &&
          route.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Search */}
          <div className="mb-6">
            <TextField.Root
              placeholder="훅 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="2"
            >
              <TextField.Slot>
                <SearchIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <Link
                    key={route.id}
                    to={route.path}
                    onClick={onClose}
                    className={cn(
                      "block px-4 py-3 rounded-lg transition-colors duration-200",
                      "hover:bg-gray-100",
                      location.pathname === route.path
                        ? "bg-violet-50 text-violet-700 border-l-4 border-violet-500"
                        : "text-gray-700"
                    )}
                  >
                    <div className="flex flex-wrap gap-1 mb-1">
                      {route.category.map((cat) => (
                        <span
                          key={cat}
                          className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                            categoryColors[cat] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {categoryLabels[cat] || cat}
                        </span>
                      ))}
                    </div>
                    <div className="font-medium">{route.title}</div>
                    {route.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {route.description}
                      </div>
                    )}
                  </Link>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="text-xs text-gray-500 text-center">
              총 {menuRoutes.length}개의 훅이 있습니다
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
