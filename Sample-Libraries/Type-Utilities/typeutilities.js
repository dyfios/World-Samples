function CheckVector2IntArrayForVector2IntString(v2iArray, v2is) {
    if (v2iArray === null) {
        return false;
    }
    
    if (v2is === null) {
        return false;
    }
    
    var v2i = JSON.parse(v2is.replaceAll("(", "[").replaceAll(")", "]"));
    
    return v2iArray.some(item => (item.x === parseInt(v2i[0]) && item.y === parseInt(v2i[1])));
}