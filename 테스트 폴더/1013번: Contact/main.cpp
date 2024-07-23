//=====================================================================
//   1013번: Contact                   
//   @date:   2024-07-22              
//   @link:   https://www.acmicpc.net/problem/1013  
//   @Motd:   폴더 내부에 있는 파일을 삭제하지 말아주세요.
//   @Test: 코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

#include <iostream>
#include <string>

void solve(void);

int main(void)
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(NULL);

	int test_case;
	std::cin >> test_case;
	for (int t = 0; t < test_case; t++)
		solve();
}

void solve(void)
{
	std::string bits;
	std::cin >> bits;

	int idx = 0;
	bool continue_flag = true;
	while (idx < bits.size() && continue_flag)
	{
		switch (bits[idx])
		{
		case '0':
			idx++;
			if (bits.size() <= idx || '0' == bits[idx])
				continue_flag = false;
			idx++;
			break;

		case '1':
			idx++;

			int next_1 = bits.find('1', idx);
			if (next_1 == std::string::npos || next_1 - idx < 2)
			{
				continue_flag = false;
				break;
			}

			int next_0 = bits.find('0', next_1);
			if (next_0 == bits.size() - 1)
			{
				continue_flag = false;
				break;
			}

			if (next_0 == std::string::npos)
			{
				idx = bits.size();
				break;
			}
			idx = next_0;
			if ('0' == bits[next_0 + 1] && 1 < next_0 - next_1)
				idx--;
			break;
		}
	}

	std::cout << (idx == bits.size() && continue_flag ? "YES" : "NO") << '\n';
}