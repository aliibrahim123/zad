//simple array diffirencing algorithm
//implements add, delete and change

var simple = (oldarr, newarr, changeLev = 3, addLev = 5, getValue = (v) => v) => {
	if (!Array.isArray(oldarr)) throw new TypeError('dlff: old of type (' + oldarr?.constructor?.type + ') expected (Array)');
	if (!Array.isArray(newarr)) throw new TypeError('dlff: new of type (' + newarr?.constructor?.type + ') expected (Array)');
	var diffarr = [], contLoop = false, //continue looping
	oitem, nitem, nlen = newarr.length, olen = oldarr.length,
	ni = 0, oi = 0, //new/old indicies
	dl = 0, //deepness level
	dv= 0; //the defference between old and returned indicies
	while (ni !== nlen && oi !== olen) {//loop till the end of either the old or new array
		dl = 0;
		contLoop = false;
		oitem = getValue(oldarr[oi]);
		nitem = getValue(newarr[ni]);
		
		//if same, continue to next
		if (oitem === nitem) { 
			oi++;
			ni++;
			continue
		}
		
		//may be a change (loop through both)
		while (dl !== changeLev) { 
			dl++;
			if (oi + dl === olen && ni + dl === nlen) {
				//if ended at both the same time, push change then break the whole
				diffarr.push({type: 'change', ind: oi + dv, count: dl, nind: ni});
				//force full breaking
				oi = olen;
				ni = nlen;
				contLoop = true;
				break
			}
			if (oi + dl === olen || ni + dl === nlen) break; //if one endes, break
			if (getValue(oldarr[oi + dl]) !== getValue(newarr[ni + dl])) continue; //if not same, continue
			diffarr.push({type: 'change', ind: oi + dv, count: dl, nind: ni}); //if found same, push change and continue to next
			oi += dl;
			ni += dl;
			contLoop = true;
			break
		}
		if (contLoop) continue;
		dl = 0;
		
		//may be an add (loop through new)
		while (dl !== addLev) { 
			dl++;
			if (ni + dl === nlen) break; //if ended, break
			if (getValue(newarr[ni + dl]) !== oitem) continue; //if not same, continue
			diffarr.push({type: 'add', ind: oi + dv, count: dl, nind: ni}); //found same, push add and continue to next
			ni += dl;
			dv += dl;
			contLoop = true;
			break
		}
		if (contLoop) continue;
		diffarr.push({type: 'delete', ind: oi + dv, count: 1}); //else, push deleted and continue to next
		dv -= 1;
		oi++;
	}
	if (oi !== olen) diffarr.push({type: 'delete', ind: oi + dv, count: olen - oi}); //if remains in old array, push whole as delete
	if (ni !== nlen) diffarr.push({type: 'add', ind: oi + dv, count: nlen - ni, nind: ni}); //if remains in new array, push whole as add
	return diffarr
};

export { simple }