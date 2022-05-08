const { requestApi, sorter, checkMulti, removeDuplicates } = require('../helpers/helperFunc');

test('sorting objects using params', () => {
	const data = [
		{
			id: 2,
			likes: 12,
			popularity: 0.2,
			reads: 32
		},
		{
			id: 3,
			likes: 13,
			popularity: 0.3,
			reads: 33
		},
		{
			id: 1,
			likes: 11,
			popularity: 0.1,
			reads: 31
		}
	];
	const SortedDataAsc = [
		{
			id: 1,
			likes: 11,
			popularity: 0.1,
			reads: 31
		},
		{
			id: 2,
			likes: 12,
			popularity: 0.2,
			reads: 32
		},
		{
			id: 3,
			likes: 13,
			popularity: 0.3,
			reads: 33
		}
	];
	const SortedDataDesc = [
		{
			id: 3,
			likes: 13,
			popularity: 0.3,
			reads: 33
		},
		{
			id: 2,
			likes: 12,
			popularity: 0.2,
			reads: 32
		},
		{
			id: 1,
			likes: 11,
			popularity: 0.1,
			reads: 31
		}
	];
	expect(sorter(data, 'id', 'asc')).toEqual(SortedDataAsc);
	expect(sorter(data, 'id', 'desc')).toEqual(SortedDataDesc);
	expect(sorter(data, 'likes', 'asc')).toEqual(SortedDataAsc);
	expect(sorter(data, 'likes', 'desc')).toEqual(SortedDataDesc);
	expect(sorter(data, 'popularity', 'asc')).toEqual(SortedDataAsc);
	expect(sorter(data, 'popularity', 'desc')).toEqual(SortedDataDesc);
	expect(sorter(data, 'reads', 'asc')).toEqual(SortedDataAsc);
	expect(sorter(data, 'reads', 'desc')).toEqual(SortedDataDesc);
});

test('Splitting a string to an array', () => {
	expect(checkMulti('1,2,3')).toEqual([ '1', '2', '3' ]);
	expect(checkMulti('')).toEqual([ '' ]);
	expect(checkMulti('1')).toEqual([ '1' ]);
	expect(checkMulti('a,b,c')).toEqual([ 'a', 'b', 'c' ]);
	expect(checkMulti('tech,culture,history')).toEqual([ 'tech', 'culture', 'history' ]);
});

test('removing duplicates from two arrays of objects', () => {
	const input_1 = [ { id: 1 }, { id: 2 }, { id: 3 } ];
	const input_2 = [ { id: 3 }, { id: 4 }, { id: 5 } ];
	const outut_1 = [ { id: 3 }, { id: 4 }, { id: 5 }, { id: 1 }, { id: 2 } ];

	expect(removeDuplicates(input_1, input_2)).toEqual(outut_1);
	expect(removeDuplicates([], input_2)).toEqual(input_2);
	expect(removeDuplicates(input_1, [])).toEqual(input_1);
});
