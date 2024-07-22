//=====================================================================
//   1009번: 분산처리                   
//   @date:   2024-07-21              
//   @link:   https://www.acmicpc.net/problem/1009  
//   @Motd:   폴더 내부에 있는 파일을 삭제하지 말아주세요.
//   @method: 코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner s = new Scanner(System.in);

    int T = s.nextInt();
		int a,b,r;
		for(int j=0;j<T;j++) {
			a=s.nextInt();
			b=s.nextInt();
			r=1;
			
			for (int i=0;i<b;i++) r=(r*a)%10;
			if(r==0) r=10;
			System.out.println(r);
		}
		s.close();
  }

}
