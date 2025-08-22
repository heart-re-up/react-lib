import { TextField } from "@radix-ui/themes";
import { SearchIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

interface MenuRoute {
  id: string;
  path: string;
  title: string;
  description?: string;
}

const menuRoutes: MenuRoute[] = [
  {
    id: "debounce",
    path: "/debounce",
    title: "useDebounce",
    description: "값의 변경을 지연시키는 훅",
  },
  {
    id: "toggle",
    path: "/toggle",
    title: "useToggle",
    description: "불린 상태를 토글하는 훅",
  },
  {
    id: "localStorage",
    path: "/localStorage",
    title: "useLocalStorage",
    description: "로컬스토리지와 동기화하는 훅",
  },
  {
    id: "progress-counter",
    path: "/progress-counter",
    title: "useProgressCounter",
    description: "비동기 작업 진행 상태를 관리하는 훅",
  },
];

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
