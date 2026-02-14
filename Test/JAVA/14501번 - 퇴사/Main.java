//=====================================================================
//   14501번:    퇴사                   
//   @date:   2026-02-14              
//   @link:   https://www.acmicpc.net/problem/14501  
//   @Motd:   폴더 내부에 있는 파일을 삭제하거나 변경하지 말아주세요.
//   @Test:   코드를 작성 후 "BOJ: 테스트"통해서 테스트를 해보세요.
//=====================================================================

import java.io.*;
import java.util.*;

public class Main {
	
	static int max=0;
	public static void main(String[] args) throws IOException {
		Scanner sc = new Scanner(System.in);
		int Case = sc.nextInt();
		int[] T = new int[Case];//소요 기간
		int[] P = new int[Case];//금액
		for(int i=0;i<Case;i++) {
			T[i]=sc.nextInt();	
			P[i]=sc.nextInt();	
		}//for
		
		int[] dp = new int[Case+1];
		
		for(int i=0;i<Case;i++) {
			 if(i+T[i]<=Case) {	//범위에 벗어나지 않는다면 
				 dp[i+T[i]]=Math.max(dp[i+T[i]],dp[i]+P[i]);	
			 }//if
			 dp[i+1]=Math.max(dp[i+1],dp[i]);	//다음dp=현재 누적값vs 다음 누적값
			 
		}//for	
		System.out.println(dp[Case]);	
	}//main()
	
}//class Main