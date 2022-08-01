function Avatar() { 
    const people = [{
        id: 0,
        name: 'Creola Katherine Johnson',
        profession: 'mathematician',
      }, {
        id: 1,
        name: 'Mario José Molina-Pasquel Henríquez',
        profession: 'chemist',
      }, {
        id: 2,
        name: 'Mohammad Abdus Salam',
        profession: 'physicist',
      }, {
        id:3,
        name: 'Percy Lavon Julian',
        profession: 'chemist',  
      }, {
        id:4,
        name: 'Subrahmanyan Chandrasekhar',
        profession: 'astrophysicist',
      }];
    return  people.filter(p => p.profession == 'chemist').map(p => <li>{p.name}</li>);
  
  }

// https://cdn.docschina.org/home/logo/angular.svg

export default function Profile() {
   const per = {
       src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.ancii.com%2Farticle%2Fimage%2Fv1%2FnE%2FQq%2FOF%2FFOQEqnhn2Rw1d5AwR24pTyc9-d8bD3-fywLbW4COgYGcuHNDc9W3r8E1BorOzMT0xsWewFFJW3rTQMqyMDEZejUya8-m1nAQEEJb3i8yxuU.jpeg&refer=http%3A%2F%2Fcdn.ancii.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659508769&t=3e9bceb4a5227add7817bad4ff65aedf',
       dsc: '可靠的人'
   }
    return(
        <ul>
      <Avatar />
    
      </ul>
    )
}