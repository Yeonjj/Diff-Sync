## data flow 

1. 클라이언트 쉐도우 서버에서 모두 같은 문자열로 시작한다. : Macs had the original point and click UI
2. 클라이언트가 다음과 같이 바꾸었다. : Macs -> Macintoches, UI -> interface
3. 이것을 diff하면 다음과 같이 두개의 변경사항으로 결과가 나온다.

```
@@ -1,11 +1,18 @@
     Mac
    +intoshe
     s had th
@@ -35,7 +42,14 @@
     ick
    -UI
    +interface
```

4. 쉐도우는 이와 동일하게 업데이트 된다.
5. 이러는 동안 서버가 다른 클라이언트에 의해 수정되었다. Macs -> Smith & Wesson 
6. 2번의 변경사항이 서버에 패치된다. 첫번째 수정은 실패한다. 왜냐하면 'intoche'를 의미있게 하기 위해 어딘가에 넣기에는 문맥이 너무 많이 바뀌었기 때문이다. 두번째 수정사항은 완전이 성공한다. 
7. 서버로 패치한 것의 결과는 다음과 같다 : Smith & Wesson had the original point and click interface.
8. 이제 반대로 과정이 시작된다. 이때 서버와 쉐도우의 Diff 결과는 다음과 같다. 

```
@@ -1,15 +1,18 @@
    -Macintoshes
    +Smith & Wesson
     had
```

9. 마지막으로 이 패치가 클라이언트에 적용된다. 그러므로 "Macs" → "Macintoshes" 수정은 "Smith & Wesson"으로 대체된다. "UI" → "interface" 수정은 그대로 둬진체로 끝난다. 또한 이 과정중 클라이언트 텍스트에 이뤄진 모든 변경사항들은 다음 동기화 과정에 포함된다.
