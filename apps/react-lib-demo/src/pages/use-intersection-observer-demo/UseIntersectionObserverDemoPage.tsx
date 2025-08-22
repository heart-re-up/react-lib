import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@heart-re-up/react-lib/hooks/useIntersectionObserver";
import { useOnScreen } from "@heart-re-up/react-lib/hooks/useOnScreen";

const LazyImage = ({ src, alt, index }: { src: string; alt: string; index: number }) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.1,
    once: true,
  });

  return (
    <div ref={ref} className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      {isIntersecting ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
            <p>이미지 {index} 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const AnimatedCounter = ({ target, isVisible }: { target: number; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + Math.ceil((target - prev) / 10);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, target]);

  return <span className="text-4xl font-bold text-blue-600">{count}</span>;
};

const UseIntersectionObserverDemoPage = () => {
  const [items, setItems] = useState(Array.from({ length: 5 }, (_, i) => i));
  const [loadingMore, setLoadingMore] = useState(false);

  // 무한 스크롤을 위한 로더
  const { isIntersecting: shouldLoadMore, ref: loaderRef } = useIntersectionObserver({
    threshold: 1.0,
  });

  // 애니메이션을 위한 요소들
  const { isVisible: isStatsVisible, ref: statsRef } = useOnScreen({
    threshold: 0.5,
  });

  const { isVisible: isFadeVisible, ref: fadeRef } = useOnScreen({
    threshold: 0.3,
    once: true,
  });

  // 무한 스크롤 로직
  useEffect(() => {
    if (shouldLoadMore && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setItems((prev) => [...prev, ...Array.from({ length: 3 }, (_, i) => prev.length + i)]);
        setLoadingMore(false);
      }, 1000);
    }
  }, [shouldLoadMore, loadingMore]);

  const images = [
    "https://picsum.photos/400/300?random=1",
    "https://picsum.photos/400/300?random=2",
    "https://picsum.photos/400/300?random=3",
    "https://picsum.photos/400/300?random=4",
    "https://picsum.photos/400/300?random=5",
  ];

  return (
    <div className="space-y-12">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">useIntersectionObserver</h1>
        <p className="mt-2 text-gray-600">
          Intersection Observer API를 사용하여 요소가 뷰포트와 교차하는지 감지하는 훅입니다.
        </p>
      </div>

      {/* Lazy Loading 데모 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Lazy Loading 이미지</h2>
        <p className="text-gray-600">
          스크롤하면서 이미지가 뷰포트에 들어올 때만 로드됩니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <LazyImage
              key={index}
              src={src}
              alt={`Lazy loaded image ${index + 1}`}
              index={index + 1}
            />
          ))}
        </div>
      </div>

      {/* 스크롤 애니메이션 데모 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">스크롤 애니메이션</h2>
        
        {/* Fade In 애니메이션 */}
        <div
          ref={fadeRef}
          className={`p-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg text-white text-center transition-all duration-1000 ${
            isFadeVisible 
              ? "opacity-100 transform translate-y-0" 
              : "opacity-0 transform translate-y-10"
          }`}
        >
          <h3 className="text-2xl font-bold mb-4">Fade In Animation</h3>
          <p>이 요소는 뷰포트에 들어오면 페이드 인 됩니다!</p>
        </div>

        {/* 카운터 애니메이션 */}
        <div ref={statsRef} className="p-8 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-center mb-8">통계 카운터</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <AnimatedCounter target={1234} isVisible={isStatsVisible} />
              <p className="text-gray-600 mt-2">사용자</p>
            </div>
            <div className="text-center">
              <AnimatedCounter target={567} isVisible={isStatsVisible} />
              <p className="text-gray-600 mt-2">프로젝트</p>
            </div>
            <div className="text-center">
              <AnimatedCounter target={89} isVisible={isStatsVisible} />
              <p className="text-gray-600 mt-2">완료율 (%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 무한 스크롤 데모 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">무한 스크롤</h2>
        <p className="text-gray-600">
          하단에 도달하면 자동으로 더 많은 아이템을 로드합니다.
        </p>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">아이템 #{item + 1}</h3>
              <p className="text-gray-600">
                이것은 무한 스크롤로 로드된 아이템입니다. 
                스크롤을 계속 내리면 더 많은 아이템이 로드됩니다.
              </p>
            </div>
          ))}
        </div>

        {/* 로더 */}
        <div ref={loaderRef} className="py-8 text-center">
          {loadingMore ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">더 많은 아이템을 로드하는 중...</span>
            </div>
          ) : (
            <p className="text-gray-400">스크롤을 내려서 더 많은 아이템을 로드하세요</p>
          )}
        </div>
      </div>

      {/* 코드 예제 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">코드 예제</h2>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm text-gray-800">
{`import { useIntersectionObserver } from '@heart-re-up/react-lib/hooks/useIntersectionObserver';

// Lazy Loading
const LazyImage = ({ src, alt }) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.1,
    once: true
  });

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <img src={src} alt={alt} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

// 무한 스크롤
const InfiniteScroll = () => {
  const [items, setItems] = useState([]);
  const { isIntersecting, ref } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting) {
      loadMoreItems();
    }
  }, [isIntersecting]);

  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      <div ref={ref}>Loading more...</div>
    </div>
  );
};`}
          </pre>
        </div>
      </div>

      {/* 특징 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">주요 특징</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">성능 최적화</h3>
            <p className="text-green-700 text-sm">
              네이티브 Intersection Observer API를 사용하여 높은 성능을 제공합니다.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">한 번만 감지</h3>
            <p className="text-blue-700 text-sm">
              once 옵션으로 한 번만 감지하고 자동으로 관찰을 중단합니다.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">유연한 설정</h3>
            <p className="text-purple-700 text-sm">
              threshold, rootMargin 등 다양한 옵션을 지원합니다.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">브라우저 호환성</h3>
            <p className="text-orange-700 text-sm">
              Intersection Observer를 지원하지 않는 브라우저에서도 작동합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseIntersectionObserverDemoPage;