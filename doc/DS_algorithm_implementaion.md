# Implementation overview

## class oaverview

A Client and a server has similar functionality, that proceed sync whenever data are edited. 

클라이언트와 서버는 둘다 데이터가 수정 될 경우 동기화를 진행한다는 동일한 기능을 가지고 있다 

다만, 클라이언트와 서버의 차이점은 서버는 클라이언트에게 따로 신호를 주기적으로 보내지 않는다는 것. 클라이언트는 서버에 주기적으로 변경사항을 채크하도록 신호를 보낸다. 그리고 그 신호에 반응하여 서버에서 변경사항이 있을시 다시 동기를 진행한다. 혹은 변경사항을 체크하지 않고 바로 새로운 동기화를 진행한다(두번째 경우가 구현하기는 더 용의하다).

동일한 기능 : ds동기화 진행.

다른 기능 : (클라이언트)주기적인 서버 데이터 체크

정리하면, 클라언트와 서버에서 ds 클래스를 사용하는 것으로. 즉 ds클래스 상속을 통해 클라이언트 서버클래스를 만드는 것은 보류.

- 알고리즘 로직 담당하는 클래스(DiffSync혹은 DS) 필요. 

- diff와 patch를 구현해야 하는 추상클래스(content혹은 data) 필요. 

> DS알고리즘은 문법적으로 diff나 patch알고리즘이 존재하는 모든 자료형에 대하여 적용이 가능하다.

TODO : diff와 patch의 결과를 어떻게 적용시킬지 정의해야한다. 왜냐하면 diff와 patch의 반환값(delta 값)을 정해야하기 때문. 이 또한 추상화 필요할 것으로 보임.
DONE : diff와 patch는 각각 delta값을 반환한다. makeEdits는 delta를 받아서 edits에 저장한다.

그림삽입 class uml

- DSComponent는 인터페이스로서 ds알고리즘의 각 요소를 만들 수 있는 추상클래스를 정의한다. 결국에는 단 한가지만 접근이 가능한데 바로 edits객체이다. 
- DSConnection는 인터페이스로서 사용자 환경에 따라 server-client연결과 client에서 보내는 주기적인 신호를 성립시킨다. Ajax를 사용할 것을 고려해서 설계해야한다. DSComponent를 통해 생성된 edits객체를 받아와서 동기될 대상에 전달한다.

- TextDS는 DSComponent를 구현한다. 여기서 diff와 patch알고리즘은 neil이 개발한 라이브러리를 사용한다.
- TextDSConnection 은 DSConnection를 구현한다. 

TODO : TextDSConnection Use-case정의하기
TODO : 각 클래스 uml제작후 각 함수나 클래스 브랜치로 만든뒤 merge

## 2018.12.3 현제 class 구조

![Image of Yaktocat](./DSObject-classes.png)



