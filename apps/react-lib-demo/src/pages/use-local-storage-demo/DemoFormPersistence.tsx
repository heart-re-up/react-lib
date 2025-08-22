import { useLocalStorage } from "@heart-re-up/react-lib/hooks/useLocalStorage";

interface FormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    birthDate: string;
  };
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    marketing: boolean;
  };
  notes: string;
}

const initialFormData: FormData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    birthDate: "",
  },
  address: {
    street: "",
    city: "",
    zipCode: "",
    country: "KR",
  },
  preferences: {
    newsletter: false,
    notifications: true,
    marketing: false,
  },
  notes: "",
};

export function DemoFormPersistence() {
  const [formData, setFormData, removeFormData, flushFormData] =
    useLocalStorage(
      "form-draft",
      initialFormData,
      { debounceDelay: 1000 } // 1초 디바운스로 자동 저장
    );

  const updatePersonalInfo = (
    field: keyof FormData["personalInfo"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateAddress = (field: keyof FormData["address"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const updatePreference = (
    field: keyof FormData["preferences"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const updateNotes = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("폼이 제출되었습니다! (실제로는 서버로 전송됨)");
    // 제출 후 임시 저장 데이터 삭제
    removeFormData();
  };

  const clearDraft = () => {
    setFormData(initialFormData);
  };

  const loadSampleData = () => {
    setFormData({
      personalInfo: {
        name: "김철수",
        email: "kimcs@example.com",
        phone: "010-1234-5678",
        birthDate: "1990-01-01",
      },
      address: {
        street: "강남대로 123",
        city: "서울",
        zipCode: "06123",
        country: "KR",
      },
      preferences: {
        newsletter: true,
        notifications: true,
        marketing: false,
      },
      notes: "배송 시 문 앞에 놓아주세요.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">폼 데이터 자동 저장</h3>
        <p className="text-gray-600 mb-6">
          입력하는 폼 데이터가 자동으로 localStorage에 저장되어 페이지를
          벗어나도 데이터가 보존됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 개인정보 섹션 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">개인정보</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 *
              </label>
              <input
                type="text"
                value={formData.personalInfo.name}
                onChange={(e) => updatePersonalInfo("name", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 *
              </label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="전화번호를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생년월일
              </label>
              <input
                type="date"
                value={formData.personalInfo.birthDate}
                onChange={(e) =>
                  updatePersonalInfo("birthDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="생년월일을 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 주소 섹션 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">주소</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                도로명 주소
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => updateAddress("street", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="도로명 주소를 입력하세요"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  도시
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="도시를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  우편번호
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => updateAddress("zipCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="우편번호를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  국가
                </label>
                <select
                  value={formData.address.country}
                  onChange={(e) => updateAddress("country", e.target.value)}
                  aria-label="국가 선택"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="KR">대한민국</option>
                  <option value="US">미국</option>
                  <option value="JP">일본</option>
                  <option value="CN">중국</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 선호도 섹션 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">알림 선호도</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.newsletter}
                onChange={(e) =>
                  updatePreference("newsletter", e.target.checked)
                }
                className="mr-3"
              />
              <span className="text-gray-600">뉴스레터 구독</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.notifications}
                onChange={(e) =>
                  updatePreference("notifications", e.target.checked)
                }
                className="mr-3"
              />
              <span className="text-gray-600">시스템 알림</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.marketing}
                onChange={(e) =>
                  updatePreference("marketing", e.target.checked)
                }
                className="mr-3"
              />
              <span className="text-gray-600">마케팅 정보 수신</span>
            </label>
          </div>
        </div>

        {/* 메모 섹션 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">추가 메모</h4>
          <textarea
            value={formData.notes}
            onChange={(e) => updateNotes(e.target.value)}
            rows={4}
            placeholder="추가로 전달할 내용이 있으면 여기에 작성하세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            제출하기
          </button>
          <button
            type="button"
            onClick={flushFormData}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            즉시 저장
          </button>
          <button
            type="button"
            onClick={loadSampleData}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            샘플 데이터
          </button>
          <button
            type="button"
            onClick={clearDraft}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={removeFormData}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            임시저장 삭제
          </button>
        </div>
      </form>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-700 mb-2">💾 자동 저장 기능</h4>
        <ul className="text-sm text-green-600 space-y-1">
          <li>• 입력 후 1초 뒤 자동으로 localStorage에 저장</li>
          <li>• 페이지 새로고침, 브라우저 종료 후에도 데이터 유지</li>
          <li>• 폼 제출 시 임시 저장 데이터 자동 삭제</li>
          <li>• 복잡한 중첩 객체도 완벽하게 동기화</li>
        </ul>
      </div>
    </div>
  );
}
