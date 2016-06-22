//just a helpful function

function swap(arr, i, j){
	var temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

// Selection sort

function minSort(arr, comp){
	var i, j, min, minIndex;
	for(i = 0; i < arr.length - 1; i++){
		min = arr[i];
		minIndex = i;	
		for(j = i + 1; j < arr.length; j++){
			if(comp(min, arr[j]) > 0){
				min = arr[j];
				minIndex = j;
			}
		}
		arr[minIndex] = arr[i];
		arr[i] = min;
	}
}

// Bubble sort

function bubbleSort(arr, comp){
	var i, j, temp;
	for(i = 0; i < arr.length - 1; i++){
		for(j = arr.length - 1; j > i; j--){
			if(comp(arr[j], arr[j - 1]) < 0){
				temp = arr[j];
				arr[j] = arr[j - 1];
				arr[j - 1] = temp;
			}
		}
	}
}

//Insertion sort

function insertionSort(arr, comp){
	var i, j, k, temp;
	for(i = 1; i < arr.length; i++){
		j = 0;
		while(j < i && comp(arr[j], arr[i]) <= 0){
			j++;
		}
		if(j != i){
			temp = arr[i];
			k = i;
			while(k > j){
				arr[k] = arr[k-1];
				k--;
			}
			arr[j] = temp;
		}
	}
}

// Insertion sort (binary search)

function insertionSortBinarySearch(arr, comp) {
    var i, j, begin, end, temp;
    for (i = 1; i < arr.length; i++) {
        if (comp(arr[i-1], arr[i]) <= 0) {
            continue;
        }

        begin = 0;
        end = i - 1;
        
        while (begin <= end) {
            j = Math.ceil((begin + end) / 2);

            if (comp(arr[i], arr[j]) < 0) {
                end = j - 1;
            } else {
                begin = j + 1;
            }
        }

        temp = arr[i];
        k = i;
        while (k > begin) {
            arr[k] = arr[k - 1];
            k--;
        }
        arr[j] = temp;
    }
}

// Shell sort (Gap sequences - by Sedgwick algorithm)

function shellSort(arr, comp) {
	// Sedgwick gaps (increments) and whole array sizes
	var SedgwickInc = [
	  1, 5, 19, 41,
	  109, 209, 505, 929,
	  2161, 3905, 8929, 16001,
	  36289, 64769, 146305, 260609,
	  587521, 1045505, 2354689, 4188161,
	  9427969, 16764929, 37730305, 67084289,
	  150958081, 268386305, 603906049, 1073643521
	];

	var SedgwickArraySize = [
	  3, 15, 57, 123,
	  327, 627, 1515, 2787,
	  6483, 11715, 26787, 48003,
	  108867, 194307, 438915, 781827,
	  1762563, 3136515, 7064067, 12564483,
	  28283907, 50294787, 113190915, 201252867,
	  452874243, 805158915, 1811718147, 3220930563
	];

	var i, j, temp, inc, size, incIdx;

	size = arr.length;

	/* calc index of initial step depending on array length */
	for (i = 1; i < 28; i++)  {
		if (SedgwickArraySize[i] > size)  {
			break;
		}
	}
	incIdx = (i - 1);

	while (incIdx >= 0)  {
		inc = SedgwickInc[incIdx--];  // set next gap
		for (i = inc; i < size; i++)  {
			temp = arr[i];
			for (j = i-inc; (j >= 0) && comp(arr[j], temp) > 0; j-=inc)  {
				arr[j+inc] = arr[j];
			}
			arr[j+inc] = temp;
		}
	}
}

//Merge sort

function mergeSort(arr, comp, start, end){
	start = start || 0;
	end = end || arr.length;
	if(end - start > 1){
		var mid = Math.floor((end + start)/2);
		mergeSort(arr, comp, start, mid);
		mergeSort(arr, comp, mid, end);
		merge(arr, comp, start, mid, end);
	}
}

function merge(arr, comp, start, mid, end){
	var i = start, j = mid, arr_temp = [];
	while(i < mid && j < end){
		if(comp(arr[i], arr[j]) < 0){
			arr_temp.push(arr[i++]);
		}else{
			arr_temp.push(arr[j++]);
		}
	}
	var k, maxk;
	if(i == mid){
		k = j;
		maxk = end;
	}else{
		k = i;
		maxk = mid;
	}
	arr_temp = arr_temp.concat(arr.slice(k, maxk));
	for(i = start, j = 0; i < end; i++, j++){
		arr[i] = arr_temp[j];
	}

}

//Quicksort (without optimizations)

function quickSort(arr, comp, start, end){
	start = start || 0;
	end = end || arr.length;
	if(start >= end - 1){
		return;
	}
	var pivot = arr[end - 1];
	var i = start, j = end - 1, temp;
	while(true){
		while(i < end && comp(arr[i], pivot) < 0){
			i++;
		}
		while(j >= start && comp(arr[j], pivot) > 0){
			j--;
		}
		if(i > j){
			break;
		}
		swap(arr, i, j);
		i++;
		j--;
	}

	quickSortMedian(arr, comp, start, i);
	quickSortMedian(arr, comp, i, end);

}

//Quicksort (median pivot)

function quickSortMedian(arr, comp, start, end){
	start = start || 0;
	end = end || arr.length;
	if(start >= end - 1){
		return;
	}
	var i = start, j = end - 1, temp;
	var pivots = [
		arr[start],
		arr[end - 1],
		arr[Math.floor((start + end - 1)/2)]
	];
	if(comp(pivots[0], pivots[1]) > 0){
		swap(pivots, 0, 1);
	}
	if(comp(pivots[1], pivots[2]) > 0){
		swap(pivots, 1, 2);
	}
	if(comp(pivots[0], pivots[1]) > 0){
		swap(pivots, 0, 1);
	}
	var pivot = pivots[1];
	while(true){
		while(i < end && comp(arr[i], pivot) < 0){
			i++;
		}
		while(j >= start && comp(arr[j], pivot) > 0){
			j--;
		}
		if(i > j){
			break;
		}
		swap(arr, i, j);
		i++;
		j--;
	}

	quickSortMedian(arr, comp, start, i);
	quickSortMedian(arr, comp, i, end);

}

//Heapsort

function heapSort(arr, comp){
	var i = Math.floor((arr.length)/2);
	while(i >= 0){
		shiftDown(arr, comp, i, arr.length - 1);
		i--;
	}
	for(i = arr.length - 1; i > 0; i--){
		swap(arr, i, 0);
		shiftDown(arr, comp, 0, i - 1);
	}
}

function shiftDown(arr, comp, n, maxheap){
	if(2*n + 1 > maxheap){
		return;
	}
	var maxchild;
	if(2*n + 2 > maxheap){
		maxchild = 2*n + 1;
	}else{
		maxchild = (comp(arr[2*n + 1], arr[2*n + 2]) > 0) ? 2*n + 1 : 2*n + 2;
	}
	if(comp(arr[n], arr[maxchild]) < 0){
		swap(arr, n, maxchild);
		shiftDown(arr, comp, maxchild, maxheap);
	}
}


function treeSortRB(arr, comp){
	var tree = new RBTree(comp);
	arr.forEach(function(item){
		tree.insert(item);
	});
	var it = tree.iterator(), i = 0, elem;
	while(it.next() && i < 1000){
		arr[i++] = it.data();
	}
}

function treeSortAVL(arr, comp){
	var tree = new AVLTree(comp);
	arr.forEach(function(item){
		tree.add(item);
	});
	var arr2 = tree.traverse();
	arr2.forEach(function(elem, index){
		arr[index] = elem;
	})
}

var sorts = [
	{
		name: "Selection sort",
		sort: minSort,
		href: "https://en.wikipedia.org/wiki/Selection_sort"
	},
	{
		name: "Bubble sort",
		sort: bubbleSort,
		href: "https://en.wikipedia.org/wiki/Bubble_sort"
	},
	{
		name: "Insertion sort",
		sort: insertionSort,
		href: "https://en.wikipedia.org/wiki/Insertion_sort"
	},
    {
        name: "Insertion sort (Binary search)",
        sort: insertionSortBinarySearch,
        href: "https://en.wikipedia.org/wiki/Insertion_sort"
    },
	{
		name: "Merge sort",
		sort: mergeSort,
		href: "https://en.wikipedia.org/wiki/Merge_sort"
	},
	{
		name: "Quicksort (unoptimized)",
		sort: quickSort,
		href: "https://en.wikipedia.org/wiki/Quicksort"
	},
	{
		name: "Quicksort (median pivot)",
		sort: quickSortMedian,
		href: "https://en.wikipedia.org/wiki/Quicksort#Choice_of_pivot"
	},
	{
		name: "Heapsort",
		sort: heapSort,
		href: "https://en.wikipedia.org/wiki/Heapsort"
	},
	{
		name: "Tree sort (RB tree)",
		sort: treeSortRB,
		href: "https://en.wikipedia.org/wiki/Tree_sort"
	},
	{
		name: "Tree sort (AVL tree)",
		sort: treeSortAVL,
		href: "https://en.wikipedia.org/wiki/Tree_sort"
	},
	{
		name: "Shell sort (Sedgwick gap sequences)",
		sort: shellSort,
		href: "https://en.wikipedia.org/wiki/Shellsort"
	}
]