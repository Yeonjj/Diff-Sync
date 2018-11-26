## DIFFERENTIAL SYNCHRONIZATION OVERVIEW

### Data flow

1. 클라이언트 쉐도우 서버에서 모두 같은 문자열로 시작한다. : Macs had the original point and click UI
2. 클라이언트가 다음과 같이 바꾸었다. : Macs -> Macintoches, UI -> interface
3. 이것을 diff 하면 다음과 같이 두 개의 변경사항으로 결과가 나온다.

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

4. 쉐도우는 이와 동일하게 업데이트된다.
5. 이러는 동안 서버가 다른 클라이언트에 의해 수정되었다. Macs -> Smith & Wesson 
6. 2번의 변경사항이 서버에 패치된다. 첫 번째 수정은 실패한다. 왜냐하면 'intoche'를 의미 있게 하기 위해 어딘가에 넣기에는 문맥이 너무 많이 바뀌었기 때문이다. 두 번째 수정사항은 완전히 성공한다. 
7. 서버로 패치한 것의 결과는 다음과 같다 : Smith & Wesson had the original point and click interface.
8. 이제 반대로 과정이 시작된다. 이때 서버와 쉐도우의 Diff 결과는 다음과 같다. 

```
@@ -1,15 +1,18 @@
    -Macintoshes
    +Smith & Wesson
     had
```

9. 마지막으로 이 패치가 클라이언트에 적용된다. 그러므로 "Macs" → "Macintoshes" 수정은 "Smith & Wesson"으로 대체된다. "UI" → "interface" 수정은 그대로 둔 체로 끝난다. 또한 이 과정 중 클라이언트 텍스트에 이뤄진 모든 변경사항들은 다음 동기화 과정에 포함된다.

## DUAL SHADOW METHOD

클라이언트 텍스트와 서버 쉐도우(또는 서버 텍스트와 클라이언트 쉐도우)는 동기화 반이 진행 됬을 때 반드시 동일해야한다.

1. 클라이언트 텍스트가 사용자에 의해 바뀐다. 
2. 클라이언트 텍스트와 쉐도우와 Diff 하여 edit 객체들을 얻는다.
3. 이 edit들에는 클라이언트 버전 넘버 'n'이 테그된다. 이 n은 클라이언트 쉐도우가 만들어 졌을 때 버전 넘버와 관련이 있다. 
4. 클라이언트 쉐도우는 클라이언트 텍스트의 값으로 갱신된다. 그리고 버전 넘버가 1증가한다. 
5. edit들은 클라이언트가 바로 이전 연결을 통해 알고 있는 서버 버전 넘버 'm'과 함께 서버로 보내진다. (내가 알고 있는 너의 모습은 이거라고 말하는 것과 같음)
6. 서버의 서버 쉐도우는 제공된 클라이언트 버전 넘버와 제공된 서버 버전 넘버와 같아야한다.
7. 서버는 edit을 서버 쉐도우에 패치시킨다. 
8. 서버 쉐도우의 클라이언트 버전 넘버를 1증가시킨다. 
9. 백업 쉐도우에 서버 쉐도우를 백업한다. 
10. 마지막으로 서버는 edit들을 서버텍스트에 패치 시킨다. 

이후는 대칭적으로 서버에서 클라이언트로 실행된다. 단, 클라이언트는 백업 쉐도우를 가지지 않는다. 

되돌아오는 통신에 서버는 클라이언트에게 수신한 edit 들의 버전 'n'을 알려준다. 
이것으로 클라이언트는 edit스택에서 'n'까지의 edit들을 지운다. 'n'까지의 edit을 성공적으로 서버에서 처리했기 때문.

### 클라이언트에 백업 쉐도우가 없는 이유? 

이것은 두 개체의 태생적으로 비대칭적인 연결에서 비롯된다. 알고리즘에서 양쪽이 완전히 대칭되려면 연결방식도 완전히 대칭이어야 한다. 그러나 웹 클라이언트-서버 모델에서는 항상 클라이언트에서 서버로 연결을 요청한다. 

즉, 클라이언트에서 보낸 연결요청을 잃어버리지만, 서버의 연결요청를 받는 경우는 없는 탓에 클라이언트 백업은 필요하지 않다. 연결요청은 곧 데이터에도 대응된다. 그러나 다른 유저에서 바뀐 데이터는 여기서 잃어버린 연결이라고 대응시키지 않는다. 왜냐하면 이 경우에도 클라이언트에서 연결요청을 보낸 뒤에 되돌아오는 데이터를 받는 것이기 때문이다. 

만약 peer-to-peer 나 server-to-server를 디자인할 경우에는 완전히 대칭 연결이 가능하기 때문에 양쪽이 백업이 필요할 것이다. 

## 이중 쉐도우의 애러 처리 과정

- 이중 패킷 
- 아웃바운드 패킷의 상실
- 인바운드 패킷의 상실
- 순서를 상실한 패킷
- 메모리나 네트워크상에서 데이터의 오염

## Diff와 Patch 

diff 알고리즘과 patch 알고리즘만 구현된다면, DS는 어떤 컨텐츠도 다룰 수 있다(plain text, rich text, bitmaps, vector graphics, 등등).

### Diff

Diff가 의미 있게 되는 순간은 사용자가 기존의 컨텐트를 바꿨을 때이다. 서버 컨텐트가 그동안 또 바뀌었을 수도 있다. 때문에 diff는 반드시 대칭적으로 의미가 있어야 한다. 

예로, cat이라는 단어가 지워지고 hag로 바뀌었다고 해보자. 이를 그냥 3글자의 대체로 볼 수도 있지만 최소한의 diff를 통해 몇 글자만 수정할 수 있다.

```
    Client Text:   The cat is here.
    Client Shadow: The hag is here.
    Minimal Diff:  The chatg is here.
    Semantic Diff: The cathag is here.
```

그러나 최소한의 수정은 사용자가 의도한 문법적인 의도와는 다르다. 단어를 변경한 것이지 글자를 변경한 것이 아니다. 이런 구별이 필요한 이유는 동시에 다른 유저가 cat를 cut으로 변경했을 때를 생각해보면 된다. 결과는 hug이거나 cut으로 패치되어야 한다. 만약 최소한의 diff를 사용한다면 hug로 merge될 것이다. 이것은 의도와 다르다. 알고리즘은 최소한의 difff를 문법적으로 의미 있는 diff로 확장해야 한다. 

### Patch 

patch를 할 때는 매우 조심스럽게 해야 한다. 왜냐하면 변화분을 덮어쓰지 말아야 할 곳에 덮어쓰면 안 되기 때문이다. 

## 쉐도우의 필요성

 개인적으로 쉐도운 다음과 같은 이유에 의해 필요하다고 생각한다. 
비동기적이라 함은 네트워크상의 요청에 대한 응답을 기다리는 동안 사용자의 입력을 허용하는 것이다. 즉 다른 사용자가 서버의 텍스트를 바꾸는 중이더라도 여전히 입력이 가능한 것이다. 3-way-merge는 merge가 일어나는 동안 사용자가 수정하는 경우 자신의 수정사항을 모두 잃어버린다. 동기적으로 동작하기 때문이다. 따라서 이를 방지하기 위해서 필연적으로 사용자와 중앙 merge서버와 동기할 때 이전에 수정이 이루어졌나 다시 비교할 수 있는 방법이 필요하게 된다. 이를 위해서 결국 클라이언트가 서버의 텍스트를 저장할 컨테이너가 필요할 것이고 이렇게 되면 굳이 매번 서버의 텍스트를 불러와서 저장하고 비교하는 낭비를 할 필요가 없어진다. 결과적으로 각 로컬에 서버와 클라이언트를 미리 알아볼 수 있는 쉐도우를 갖게 된다. 그리고 이때는 사실 DS 알고리즘과는 다른 방식의 동기를 하게 되는데 이 방식이 발전하면서 DS의 모습을 갖추게 될 것으로 생각된다. 

사용자 입장에서 계속 서버에 입력을 해야 하는데 기본적으로 서버는 모든 패킷을 한 번에 하나만 처리할 수 있다. 따라서 사용자가 임시로 계속해서 수정사항을 쉐도우에 입력하는 동한 다른 사용자도 쉐도우에 입력을 계속할 수 있다. 즉, 쉐도우는 수정본이 아닌 원본의 쉐도우라고 간주하는 것.

## DS 알고리즘 기대 효과

 알고리즘의 주요 속성은:
- 서버와 클라이언트에서 돌아가는 거의 동일한 코드 
- 상태 기반이라 수정사항희 이력을 유지하지 않아도 된다.
- 비동기이다. 네트워크상의 응답을 기다리는 동안 사용자 입력을 블록킹 하지 않는다.
- 긴 대기와 신뢰성 없는 네트워크에도 관대하다.
- 애러가 갈라져서 다른 복사본을 만드는 일이 없다. 수렴적이다.
- 문법적으로 diff나 patch 알고리즘이 존재하는 모든 자료형에 대하여 적용할 수 있다.
- 확장 축소가 매우 용의하다.
 
 논문에 의하면 자동 저장기능으로도 활용이 가능하다고 함.
 
 OT알고리즘은 기본적으로 Edit-based이다. 사용자의 모든 말 그대로 하나도 빠짐없이 모든 행동을 캡쳐해서 비교해야 한다. 그러나 이런 시스템은 robust하다고 할 수 없다. 그러나 ds는 필연적으로 failiure tolerence하다. 언제나 동기화에 성공하게 된다. 두 알고리즘의 관점은 좀 다르다. Neil은 이 문제에 대하여 다음과 같이 꼬집는다. 

>  Obtaining a snapshot of the state is usually trivial, but capturing edits is a different matter altogether. A practical challenge with edit-based synchronization is that all user actions must be captured. Obvious ones include typing, but edits such as cut, paste, drag, drop, replacements and autocorrect must also be caught. The richness of modern user interfaces can make this problematic, especially within a browser-based environment. Any failure during edit passing results in a fork. Since each edit changes the location of subsequent edits, one lost edit may cause subsequent edits to be applied incorrectly, thus increasing the gap between the two versions. This is further complicated by the best- effort nature of most networking systems. If a packet gets lost or significantly delayed, the system must be able to recover gracefully
