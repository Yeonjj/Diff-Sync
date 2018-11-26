## DIFFERENTIAL SYNCHRONIZATION OVERVIEW

### Data flow

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

## DUAL SHADOW METHOD

클라이언트 텍스트와 서버 쉐도우(또는 서버 텍스트와 클라이언트 쉐도우)는 동기화 반이 진행 됬을때 반드시 동일해야한다.


## 쉐도우의 필요성

 개인적으로 쉐도운 다음과 같은 이유에 의해 필요하다고 생각한다. 
비동기적이라함은 네트워크상의 요청에대한 응답을 기다리는 동안 사용자의 입력을 허용하는 것이다. 즉 다른 사용자가 서버의 텍스트를 바꾸는 중이더라도 여전히 입력이 가능한 것이다. 3-way-merge는 merge가 일어나는 동안 사용자가 수정을 하는 경우 자신의 수정사항을 모두 잃어버린다. 동기적으로 동작하기 때문이다. 따라서 이를 방지하기 위해서 필연적으로 사용자와 중앙 merge서버와 동기할 때 이전에 수정이 이루어졌나 다시 비교할 수있는 방법이 필요하게 된다. 이를 위해서 결국 클라이언트가 서버의 텍스트를 저장할 컨테이너가 필요할 것이고 이렇게 되면 굳이 매번 서버의 텍스트를 불러와서 저장하고 비교하는 낭비를 할 필요가 없어진다. 결과적으로 각 로컬에 서버와 클라이언트를 미리 알아볼 수 있는 쉐도우를 갖게 된다. 그리고 이때는 사실 DS 알고리즘과는 다른 방식의 동기를 하게 되는데 이 방식이 발전하면서 DS의 모습을 갖추게 될 것으로 생각된다. 

사용자입장에서 계속 서버에 입력을 해야하는데 기본적으로 서버는 모든 패킷을 한번에 하나만 처리할 수있다. 따라서 사용자가 임시로 계속해서 수정사항을 쉐도우에 입력하는 동한 다른 사용자도 쉐도우에 입력을 계속 할 수있다. 즉, 쉐도우는 수정본이 아닌 원본의 쉐도우라고 간주하는 것.

## DS 알고리즘 기대 효과

 알고리즘의 주요 속성은:
- 서버와 클라이언트에서 돌아가는 거의 동일한 코드 
- 상태 기반이라 수정사항희 이력을 유지하지 않아도 된다.
- 비동기이다. 네트워크상의 응답을 기다리는 동안 사용자 입력을 블록킹하지 않는다.
- 긴 대기와 신뢰성없는 네트워크에도 관대하다.
- 애러가 갈라져서 다른 복사본을 만드는 일이 없다. 수렴적이다.
- 문법적으로 diff나 patch알고리즘이 존재하는 모든 자료형에 대하여 적용이 가능하다.
- 확장 축소가 매우 용의하다.
 
 논문에 의하면 자동 저장기능으로도 활용이 가능하다고 함.
 
 OT알고리즘은 기본적으로 Edit-based이다. 사용자의 모든 말그대로 하나도 빠짐없이 모든 행동을 캡쳐해서 비교해야한다. 그러나 이런 시스템은 robust하다고 할 수 없다. 그러나 ds는 필연적으로 failiure tolerence하다. 언제나 동기화에 성공하게 된다. 두 알고리즘의 관점은 좀 다르다. Neil은 이 문제에 대하여 다음과 같이 꼬집는다. 

>  Obtaining a snapshot of the state is usually trivial, but capturing edits is a different matter altogether. A practical challenge with edit-based synchronization is that all user actions must be captured. Obvious ones include typing, but edits such as cut, paste, drag, drop, replacements and autocorrect must also be caught. The richness of modern user interfaces can make this problematic, especially within a browser-based environment. Any failure during edit passing results in a fork. Since each edit changes the location of subsequent edits, one lost edit may cause subsequent edits to be applied incorrectly, thus increasing the gap between the two versions. This is further complicated by the best- effort nature of most networking systems. If a packet gets lost or significantly delayed, the system must be able to recover gracefully
