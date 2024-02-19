function checkCharAE(val: string): boolean {
  const rep = [
    [44060, 44087],
    [44648, 44675],
    [45236, 45263],
    [45824, 45851],
    [46412, 46439],
    [47000, 47027],
    [47588, 47615],
    [48176, 48203],
    [48764, 48791],
    [49352, 49379],
    [49940, 49967],
    [50528, 50555],
    [51116, 51143],
    [51704, 51731],
    [52292, 52319],
    [52880, 52907],
    [53468, 53495],
    [54056, 54083],
    [54644, 54671],
  ];
  let result = false;
  rep.forEach((range) => {
    if (val.charCodeAt(0) >= range[0] && val.charCodeAt(0) <= range[1]) {
      result = true;
    }
  });
  return result;
}
export function regularize(val: string) {
  
  let regularized =  val.toLowerCase().replace(/\s/g, '');
  let regArr: string[] = [];
  Array.from(regularized).forEach((char) => {
    if (checkCharAE(char)) {
      // 개 to 게
      regArr.push(String.fromCharCode(char.charCodeAt(0) + 112));
    } else {
      regArr.push(char);
    }
  });
  return regArr.join('');
}