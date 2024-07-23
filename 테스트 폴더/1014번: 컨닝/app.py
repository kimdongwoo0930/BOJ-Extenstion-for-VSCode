#=====================================================================
#   1014번: 컨닝                   
#   @date:   2024-07-22              
#   @link:   https://www.acmicpc.net/problem/1014  
#   @Motd:   폴더 내부에 있는 파일을 삭제하지 말아주세요.
#   @Test: 코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
#=====================================================================



def bip_match(n, m): # 이분 매칭
    for nn, mm in [(n, m - 1), (n, m + 1), (n - 1, m - 1), (n - 1, m + 1), (n + 1, m - 1), (n + 1, m + 1)]: # 6방향으로 탐색
        if 0 <= nn < N and 0 <= mm < M and not visited[nn][mm] and seat[nn][mm]:
            visited[nn][mm] = True
            if connect[nn][mm] == [-1, -1] or bip_match(connect[nn][mm][0], connect[nn][mm][1]):
                connect[nn][mm] = [n, m]       
                return True
    return False

for _ in range(int(input())):
    N, M = map(int, input().split())
    matrix = [input().strip() for _ in range(N)]
    
    seat = [[False] * M for _ in range(N)] # 앉을 수 있는 자리인지 저장하기 위한 행렬
    answer = 0
    for n in range(N):
        for m in range(M):
            if matrix[n][m] == '.':
                seat[n][m] = True
                answer += 1 # 앉을 수 있는 자리이면 seat 갱신해주고 answer에 자리 수 저장
                
    connect = [[[-1] * 2 for _ in range(M)] for __ in range(N)] # 각 자리 별 연결 위치를 저장하는 행렬
    for n in range(N):
        for m in range(0, M, 2): # 여기서 짝수로 해도 되고 홀수로 해도 된다. 물론, 둘 다 하면 안된다.
            if seat[n][m]:
                visited = [[False] * M for _ in range(N)]
                if bip_match(n, m):
                    answer -= 1 # 이분 매칭이 될 때마다 앉을 수 있는 자리가 하나씩 줄어든다
                    
    print(answer)
