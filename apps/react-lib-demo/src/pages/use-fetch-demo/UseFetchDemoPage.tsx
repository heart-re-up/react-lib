import { useState } from "react";
import { useFetch } from "@heart-re-up/react-lib/hooks/useFetch";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const UseFetchDemoPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<number>(1);
  const [manualUrl, setManualUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");

  // 자동 fetch - 사용자 목록
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
  } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users");

  // 의존성이 있는 fetch - 선택된 사용자의 게시물
  const {
    data: userPosts,
    loading: postsLoading,
    error: postsError,
  } = useFetch<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`, {
    deps: [selectedUserId],
  });

  // 수동 fetch
  const {
    data: manualData,
    loading: manualLoading,
    error: manualError,
    refetch: manualRefetch,
  } = useFetch<Post>(manualUrl, {
    auto: false,
  });

  // 데이터 변환이 있는 fetch
  const {
    data: transformedData,
    loading: transformedLoading,
    error: transformedError,
  } = useFetch<{ count: number; titles: string[] }>(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
    {
      transform: (data: Post[]) => ({
        count: data.length,
        titles: data.map((post) => post.title),
      }),
    }
  );

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">useFetch</h1>
        <p className="mt-2 text-gray-600">
          fetch API를 사용한 간단한 데이터 페칭 훅입니다.
        </p>
      </div>

      {/* 자동 fetch 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">자동 Fetch - 사용자 목록</h2>
        <p className="text-gray-600">컴포넌트가 마운트되면 자동으로 데이터를 가져옵니다.</p>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          {usersLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600">사용자 목록을 로드하는 중...</span>
            </div>
          )}
          
          {usersError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">에러: {usersError.message}</p>
            </div>
          )}
          
          {users && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="p-4 bg-white rounded-lg shadow">
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p className="text-gray-600 text-sm">{user.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 의존성이 있는 fetch 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">의존성 Fetch - 사용자별 게시물</h2>
        <p className="text-gray-600">선택된 사용자가 변경되면 자동으로 해당 사용자의 게시물을 가져옵니다.</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사용자 선택:
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                사용자 {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          {postsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-green-600">게시물을 로드하는 중...</span>
            </div>
          )}
          
          {postsError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">에러: {postsError.message}</p>
            </div>
          )}
          
          {userPosts && (
            <div className="space-y-4">
              <p className="font-semibold text-green-800">
                사용자 {selectedUserId}의 게시물 ({userPosts.length}개)
              </p>
              <div className="space-y-3">
                {userPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-white rounded border">
                    <h4 className="font-semibold text-gray-800">{post.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{post.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 수동 fetch 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">수동 Fetch</h2>
        <p className="text-gray-600">버튼을 클릭해야만 데이터를 가져옵니다.</p>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="API URL을 입력하세요"
          />
          <button
            onClick={manualRefetch}
            disabled={manualLoading}
            className={`px-4 py-2 rounded transition-colors ${
              manualLoading
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {manualLoading ? "로딩 중..." : "Fetch"}
          </button>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          {manualError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-600">에러: {manualError.message}</p>
            </div>
          )}
          
          {manualData ? (
            <div className="p-4 bg-white rounded border">
              <h4 className="font-semibold text-gray-800">{manualData.title}</h4>
              <p className="text-gray-600 text-sm mt-2">{manualData.body}</p>
              <p className="text-gray-400 text-xs mt-2">ID: {manualData.id}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              위의 Fetch 버튼을 클릭하여 데이터를 가져오세요
            </p>
          )}
        </div>
      </div>

      {/* 데이터 변환 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">데이터 변환</h2>
        <p className="text-gray-600">원본 데이터를 가공하여 필요한 형태로 변환합니다.</p>
        
        <div className="p-4 bg-orange-50 rounded-lg">
          {transformedLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-2 text-orange-600">데이터를 변환하는 중...</span>
            </div>
          )}
          
          {transformedError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">에러: {transformedError.message}</p>
            </div>
          )}
          
          {transformedData && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded border">
                <h4 className="font-semibold text-orange-800 mb-2">
                  변환된 데이터 (총 {transformedData.count}개의 게시물)
                </h4>
                <ul className="space-y-1">
                  {transformedData.titles.map((title, index) => (
                    <li key={index} className="text-gray-600 text-sm">
                      {index + 1}. {title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 코드 예제 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">코드 예제</h2>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm text-gray-800">
{`import { useFetch } from '@heart-re-up/react-lib/hooks/useFetch';

// 기본 사용법
const { data, loading, error } = useFetch('/api/users');

// 수동 fetch
const { data, refetch } = useFetch('/api/data', {
  auto: false
});

// 의존성과 함께
const [userId, setUserId] = useState(1);
const { data } = useFetch(\`/api/users/\${userId}\`, {
  deps: [userId]
});

// 데이터 변환
const { data } = useFetch('/api/posts', {
  transform: (posts) => ({
    count: posts.length,
    titles: posts.map(p => p.title)
  })
});`}
          </pre>
        </div>
      </div>

      {/* 특징 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">주요 특징</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">자동 취소</h3>
            <p className="text-green-700 text-sm">
              컴포넌트가 언마운트되거나 새 요청이 시작되면 이전 요청을 자동으로 취소합니다.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">의존성 관리</h3>
            <p className="text-blue-700 text-sm">
              deps 배열의 값이 변경되면 자동으로 다시 fetch를 실행합니다.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">데이터 변환</h3>
            <p className="text-purple-700 text-sm">
              transform 함수로 응답 데이터를 원하는 형태로 변환할 수 있습니다.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">에러 처리</h3>
            <p className="text-orange-700 text-sm">
              HTTP 에러와 네트워크 에러를 자동으로 처리하고 상태로 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseFetchDemoPage;