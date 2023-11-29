import { useState, useTransition, memo, Fragment } from 'react';
 
const TabButton =({ children, isActive, onClick }) => {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

const AboutTab = () => {
  <p>Welcome to my profile!</p>
}

const PostsTab = memo(function PostsTab() {
  // 打印一次。真正变慢的地方在 SlowPost 内。
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 每个 item 都等待 1 毫秒以模拟极慢的代码。
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}
const ContactTab = () =>{
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}

  function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
const recipes = [
  {
    id: 'greek-salad',
    name: '希腊沙拉',
    ingredients: ['西红柿', '黄瓜', '洋葱', '油橄榄', '羊奶酪'],
  },
  {
    id: 'hawaiian-pizza',
    name: '夏威夷披萨',
    ingredients: ['披萨饼皮', '披萨酱', '马苏里拉奶酪', '火腿', '菠萝'],
  },
  {
    id: 'hummus',
    name: '鹰嘴豆泥',
    ingredients: ['鹰嘴豆', '橄榄油', '蒜瓣', '柠檬', '芝麻酱'],
  },
];
const Recipes = ({id,name, ingredients}) => {
    return (
      <div >
         <h1>{name}</h1>
         <ul>{ingredients.map(i => <li key={i}>{i}</li>)}</ul>
      </div>
    )
}

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
}; //1,2,3
let len = poem.lines.length -1;
export function Index() {
   return (
      <article style={{padding: '16px', width: '600px'}}>
        
        {
          poem.lines.map((i,index)=> <Fragment key={'chint'+i}>
             {index > 0 && <hr/>} 
            <p>{i}</p>
             
          </Fragment>)
        }
      </article>
   )
}

function Item({ name, importance }) {
   
 
    return (<li className="item">{name}{importance >0 && (<i>(重要性:{importance})</i>)}</li>);
 
 
}

export  function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
      <Item 
          importance={9} 
          name="宇航服" 
        />
        <Item 
          importance={0} 
          name="带金箔的头盔" 
        />
        <Item 
          importance={6} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}

function Drink({ name }) {
  let obj = {
    plan: 'leaf',
    content: '15–70 mg/cup',
    age: '4,000+ years'
  }
  if(name !=='tea' ) {
    obj= {
      plan: 'bean',
      content: '80–185 mg/cup',
      age: '1,000+ years'
    }
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{obj.plan}</dd>
        <dt>Caffeine content</dt>
        <dd>{obj.content}</dd>
        <dt>Age</dt>
        <dd>{obj.age}</dd>
      </dl>
    </section>
  );
}

 function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}

export  function Bio() {
  return (
    <Fragment>
    <div class="intro">
      <h1>欢迎来到我的站点！</h1>
    </div>
    <p class="summary">
      你可以在这里了解我的想法。
      <br></br>
      <b>还有科学家们的<i>照片</i></b>
    </p>
    </Fragment>
  );
 
}


const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
}

export  function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl+person.imageId+person.imageSize+'.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
       <TodoList />
       <TodoList />
    </Card>
  );
}



/* 

key 只有在就近的数组上下文中才有意义

*/