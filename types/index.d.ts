interface Options {
  separator?: string;
  useModifiers?: boolean,
  uniformCenterMoves?: false | 'rotation' | 'slice'
  invert?: boolean
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/710943739f2313edc16526989c5ea83f0929b324/types/pegjs/index.d.ts#L6
declare namespace PEG {
	interface Location {
		line: number;
		column: number;
		offset: number;
	}

	interface LocationRange {
		start: Location,
		end: Location
	}

	class SyntaxError {
		line: number;
		column: number;
		offset: number;
		location: LocationRange;
		expected:any[];
		found:any;
		name:string;
		message:string;
	}
}

interface normalize {
  (algorithm: string, options?: Options): string
  SyntaxError: PEG.SyntaxError
}

export default normalize
