const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];
export const layout =  [...Array(32)].map((_, i)=> {
    return {
        i: i.toString(),
        x: i%8,
        y: Math.floor(i/8),
        w:1,
        h:1,
       // minW: 1,
       // maxW:8,
       resizeHandles: availableHandles,
    }

})