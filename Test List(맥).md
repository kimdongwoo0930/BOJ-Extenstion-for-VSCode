# BOJ Extension for VSCode - Test Checklist

## 📋 테스트 환경 정보

- **테스트 날짜**: ****\_\_\_****
- **운영체제**: [ ] Windows 10/11 [ ] macOS Intel [ ] macOS Apple Silicon [ ] Ubuntu/Linux
- **OS 버전**: ****\_\_\_****
- **VSCode 버전**: ****\_\_\_****
- **Node.js 버전**: ****\_\_\_****

---

## 🔧 환경 설정 확인

### 필수 도구 설치 확인

- [ ] Node.js 설치됨 (`node --version`)
- [ ] Python 설치됨 (`python --version` 또는 `python3 --version`)
- [ ] GCC 설치됨 (`gcc --version`)
- [ ] G++ 설치됨 (`g++ --version`)
- [ ] Java JDK 설치됨 (`javac -version`)

**설치 안 된 것:** ****\_\_\_****

---

## 🎯 기능별 테스트

## 1️⃣ Extension 기본 기능

### Extension 설치 및 활성화

- [ ] Extension 설치 완료
- [ ] Extension 활성화 확인 (BOJ 아이콘 사이드바에 표시)
- [ ] 커맨드 팔레트에서 "BOJ" 검색 시 명령어 표시됨

**문제 발생 시:** ****\_\_\_****

---

## 2️⃣ 문제 생성 기능

### 커맨드: `BOJ: 파일 생성 및 문제 보기`

#### 테스트 1: 1000번 문제 (A+B)

- [ ] 문제 번호 입력: `1000`
- [ ] 폴더 생성 확인 (`1000` 폴더)
- [ ] HTML 파일 생성 확인 (`1000.html`)
- [ ] 언어별 파일 생성 확인:
  - [ ] `main.py` (Python)
  - [ ] `main.c` (C)
  - [ ] `main.cpp` (C++)
  - [ ] `index.js` (JavaScript)
  - [ ] `Main.java` (Java)
- [ ] Webview에 문제 내용 표시됨

**문제 발생 시:** ****\_\_\_****

#### 테스트 2: 10950번 문제 (A+B - 3, 반복 입력)

- [ ] 문제 번호 입력: `10950`
- [ ] 폴더 및 파일 생성 확인
- [ ] 문제 내용 표시 확인

**문제 발생 시:** ****\_\_\_****

---

### 커맨드: `BOJ: 파일 생성없이 문제 보기`

- [ ] 문제 번호 입력 시 Webview만 표시됨
- [ ] 파일 생성 안 됨 확인

**문제 발생 시:** ****\_\_\_****

---

### 커맨드: `BOJ: 현재 문제 보기`

- [ ] 이미 생성된 문제 폴더에서 실행
- [ ] 해당 문제 다시 표시됨

**문제 발생 시:** ****\_\_\_****

---

## 3️⃣ 테스트 실행 기능

### 커맨드: `BOJ: 테스트`

**테스트 조건:**

- 1000번 문제 (A+B) 사용
- 입력: `1 2` → 출력: `3`

---

### Python (main.py)

**코드:**

```python
a, b = map(int, input().split())
print(a + b)
```

**실행 결과:**

- [ ] ✅ 테스트 통과
- [ ] ❌ 테스트 실패
- [ ] ⚠️ 런타임 에러

**출력 채널 결과:**

- [ ] 입력/출력 표시됨
- [ ] 실행 시간 표시됨
- [ ] Pass/Fail 표시됨

**문제 발생 시:** ****\_\_\_****

---

### JavaScript (index.js)

**코드:**

```javascript
const fs = require("fs");
const input = fs.readFileSync("input.txt").toString().trim().split(" ");
const a = Number(input[0]);
const b = Number(input[1]);
console.log(a + b);
```

**실행 결과:**

- [ ] ✅ 테스트 통과
- [ ] ❌ 테스트 실패
- [ ] ⚠️ 런타임 에러

**추가 확인:**

- [ ] `input.txt` 파일 생성됨
- [ ] `input.txt` 내용 확인: `1 2`

**문제 발생 시:** ****\_\_\_****

---

### C (main.c)

**코드:**

```c
#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n", a + b);
    return 0;
}
```

**실행 결과:**

- [ ] ✅ 컴파일 성공
- [ ] ✅ 테스트 통과
- [ ] ❌ 컴파일 실패
- [ ] ❌ 테스트 실패
- [ ] ⚠️ 런타임 에러

**추가 확인:**

- [ ] 실행 파일 생성됨 (`main.exe` on Windows, `main` on Unix)

**문제 발생 시:** ****\_\_\_****

---

### C++ (main.cpp)

**코드:**

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
```

**실행 결과:**

- [ ] ✅ 컴파일 성공
- [ ] ✅ 테스트 통과
- [ ] ❌ 컴파일 실패
- [ ] ❌ 테스트 실패
- [ ] ⚠️ 런타임 에러

**추가 확인:**

- [ ] 실행 파일 생성됨 (`main.exe` on Windows, `main` on Unix)

**문제 발생 시:** ****\_\_\_****

---

### Java (Main.java)

**코드:**

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}
```

**실행 결과:**

- [ ] ✅ 컴파일 성공 (javac)
- [ ] ✅ 테스트 통과
- [ ] ❌ 컴파일 실패
- [ ] ❌ 테스트 실패
- [ ] ⚠️ 런타임 에러

**추가 확인:**

- [ ] `.class` 파일 생성됨 (`Main.class`)

**문제 발생 시:** ****\_\_\_****

---

## 4️⃣ 예외 상황 테스트

### 잘못된 코드 테스트

**Python 런타임 에러:**

```python
print(1/0)  # Division by zero
```

- [ ] 에러 메시지 출력됨
- [ ] "⚠️ RUNTIME ERROR" 표시됨

**문제 발생 시:** ****\_\_\_****

---

### 틀린 답 테스트

**Python 틀린 코드:**

```python
a, b = map(int, input().split())
print(a - b)  # 틀린 연산
```

- [ ] "❌ FAIL" 표시됨
- [ ] 예상 출력 vs 실제 출력 비교 표시됨

**문제 발생 시:** ****\_\_\_****

---

### 존재하지 않는 문제 번호

- [ ] 문제 번호 입력: `999999`
- [ ] 에러 메시지 표시됨

**문제 발생 시:** ****\_\_\_****

---

## 5️⃣ 복잡한 테스트 케이스

### 다중 테스트 케이스 (10950번)

**코드 예시 (Python):**

```python
t = int(input())
for _ in range(t):
    a, b = map(int, input().split())
    print(a + b)
```

- [ ] 모든 테스트 케이스 통과
- [ ] RESULT SUMMARY 표시됨
- [ ] 통과율 표시됨 (예: `✔ 3 / 3 Tests Passed (100.0%)`)

**문제 발생 시:** ****\_\_\_****

---

## 6️⃣ UI/UX 테스트

### Output Channel

- [ ] "Test Cases" 채널 자동 생성됨
- [ ] 결과가 보기 좋게 포맷됨
- [ ] 구분선(═, ─) 제대로 표시됨
- [ ] 이모지 제대로 표시됨 (✅, ❌, ⚠️, 📊)

**문제 발생 시:** ****\_\_\_****

---

### Webview (문제 보기)

- [ ] 문제 제목 표시됨
- [ ] 시간 제한, 메모리 제한 표시됨
- [ ] 문제 설명 읽기 쉬움
- [ ] 예제 입출력 표시됨

**문제 발생 시:** ****\_\_\_****

---

## 📊 테스트 결과 요약

### 통과한 기능

- Python: [ ] ✅ [ ] ❌
- JavaScript: [ ] ✅ [ ] ❌
- C: [ ] ✅ [ ] ❌
- C++: [ ] ✅ [ ] ❌
- Java: [ ] ✅ [ ] ❌

### 발견된 버그 목록

1. ***
2. ***
3. ***

### 개선 제안

1. ***
2. ***
3. ***

---

## 📝 테스터 정보

- **이름**: ****\_\_\_****
- **GitHub**: ****\_\_\_****
- **연락처**: ****\_\_\_****
- **추가 코멘트**:

---

---

---

---

## ✅ 최종 체크

- [ ] 모든 테스트 완료
- [ ] 버그 리포트 작성 (GitHub Issues)
- [ ] 테스트 결과 공유

**테스트 완료 날짜**: ****\_\_\_****
