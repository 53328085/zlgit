import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
       console.log(entries)
       let entrie = entries[0]
       if(entrie.isIntersecting) {
         document.body.style.backgroundColor = "#ff7313"
       }else {
        document.body.style.backgroundColor = "#fff"
       }
    }, {threshold: [0, 0.25, 0.5, 0.75, 1]});
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: "100px",
      width: "100px",
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
