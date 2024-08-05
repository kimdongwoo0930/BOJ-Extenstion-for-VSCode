
# 🧩 솔루션

## 문제 URL
[문제 링크](https://www.acmicpc.net/problem/2021)

## 언어
JavaScript

## 해설 
문제 URL: https://www.acmicpc.net/problem/2021

### 1. 문제를 해결하기 위한 알고리즘 설명
이 문제는 "가장 긴 증가하는 부분 수열(LIS)" 문제로, 주어진 수열에서 가장 긴 증가하는 부분 수열의 길이를 찾는 것입니다. 이를 위해 동적 프로그래밍(DP) 또는 이분 탐색을 사용할 수 있습니다. 이 문제에서는 O(n log n) 시간 복잡도를 갖는 이분 탐색 방법을 선택하겠습니다.

### 2. 코드를 작성하는 방법 및 논리
- 입력으로 주어진 수열을 읽고, 이 수열의 각 원소에 대해 현재까지 찾은 가장 긴 증가하는 부분 수열을 업데이트합니다.
- 우리는 `dp` 배열을 유지하여 증가하는 부분 수열의 마지막 값을 저장합니다. 이 배열은 정렬된 상태를 유지하며 이분 탐색으로 효율적으로 값을 찾아 추가합니다.

### 3. 코드의 각 부분에 대한 설명
```javascript
function longestIncreasingSubsequence(arr) {
    let dp = []; // dp 배열 초기화

    for (let num of arr) {
        let left = 0;
        let right = dp.length;

        // 이분 탐색으로 올바른 위치 찾기
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (dp[mid] < num) {
                left = mid + 1; // num이 dp[mid]보다 클 경우 오른쪽 탐색
            } else {
                right = mid; // num이 dp[mid]보다 작거나 같을 경우 왼쪽 탐색
            }
        }

        // 가장 긴 증가하는 부분 수열 길이 업데이트
        if (left === dp.length) {
            dp.push(num); // 새로운 원소가 더 크면 푸시
        } else {
            dp[left] = num; // 기존 인덱스에 새로운 값 덮어쓰기
        }
    }

    return dp.length; // 가장 긴 증가하는 부분 수열의 길이 리턴
}

// 입력 및 테스트
const input = [10, 20, 10, 30, 20, 50];
console.log(longestIncreasingSubsequence(input)); // 출력: 4
```

### 4. 예제 입력과 출력에 대한 테스트
위의 코드는 예제를 통해 테스트되었습니다. 위 예제에서는 수열 `[10, 20, 10, 30, 20, 50]`가 주어졌으며, 가장 긴 증가하는 부분 수열은 `[10, 20, 30, 50]`입니다. 따라서 출력은 4가 됩니다.

이 알고리즘은 수열의 크기가 n일 때 O(n log n) 시간 복잡도로 작동하므로 매우 효율적입니다.

---

*This solution is powered by GPT.4o-mini*