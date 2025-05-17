export type EnumLike<Enum, Value> = Record<keyof Enum, Value>;

export type BitFieldResolvable<Flags extends string, Type extends number | bigint> =
	| RecursiveReadonlyArray<Flags | Type | `${bigint}` | Readonly<BitField<Flags, Type>>>
	| Flags
	| Type
	| `${bigint}`
	| Readonly<BitField<Flags, Type>>;

export interface RecursiveReadonlyArray<ItemType>
	extends ReadonlyArray<ItemType | RecursiveReadonlyArray<ItemType>> {}

/**
 * Data structure that makes it easy to interact with a bitfield.
 */
export class BitField<Flags extends string, Type extends number | bigint = number> {
	/**
	 * Numeric bitfield flags.
	 * <info>Defined in extension classes</info>
	 * @type {Object}
	 * @memberof BitField
	 * @abstract
	 */
	static Flags: EnumLike<unknown, number | bigint> = {};

	/**
	 * @type {number|bigint}
	 * @memberof BitField
	 * @private
	 */
	static DefaultBit: number | bigint = 0;

	/**
	 * Bitfield of the packed bits
	 * @type {number|bigint}
	 */
	bitfield: Type;

	/**
	 * @param {BitFieldResolvable} [bits=this.constructor.DefaultBit] Bit(s) to read from
	 */
	constructor(
		bits: BitFieldResolvable<Flags, Type> = (this.constructor as typeof BitField).DefaultBit as Type,
	) {
		/**
		 * Bitfield of the packed bits
		 * @type {number|bigint}
		 */
		this.bitfield = (this.constructor as typeof BitField).resolve(bits) as Type;
	}

	/**
	 * Checks whether the bitfield has a bit, or any of multiple bits.
	 * @param {BitFieldResolvable} bit Bit(s) to check for
	 * @returns {boolean}
	 */
	any(bit: BitFieldResolvable<Flags, Type>): boolean {
		return (
			(this.bitfield & ((this.constructor as typeof BitField).resolve(bit) as Type)) !==
			(this.constructor as typeof BitField).DefaultBit
		);
	}

	/**
	 * Checks if this bitfield equals another
	 * @param {BitFieldResolvable} bit Bit(s) to check for
	 * @returns {boolean}
	 */
	equals(bit: BitFieldResolvable<Flags, Type>): boolean {
		return this.bitfield === ((this.constructor as typeof BitField).resolve(bit) as Type);
	}

	/**
	 * Checks whether the bitfield has a bit, or multiple bits.
	 * @param {BitFieldResolvable} bit Bit(s) to check for
	 * @returns {boolean}
	 */
	has(bit: BitFieldResolvable<Flags, Type>): boolean {
		const resolvedBit = (this.constructor as typeof BitField).resolve(bit) as Type;
		return (this.bitfield & resolvedBit) === resolvedBit;
	}

	/**
	 * Gets all given bits that are missing from the bitfield.
	 * @param {BitFieldResolvable} bits Bit(s) to check for
	 * @param {...*} hasParams Additional parameters for the has method, if any
	 * @returns {string[]}
	 */
	missing(bits: BitFieldResolvable<Flags, Type>, ...hasParams: readonly unknown[]): Flags[] {
		return new (this.constructor as new (
			bits: BitFieldResolvable<Flags, Type>,
		) => BitField<Flags, Type>)(bits)
			.remove(this)
			.toArray(...hasParams);
	}

	/**
	 * Freezes these bits, making them immutable.
	 * @returns {Readonly<BitField>}
	 */
	freeze(): Readonly<BitField<Flags, Type>> {
		return Object.freeze(this);
	}

	/**
	 * Adds bits to these ones.
	 * @param {...BitFieldResolvable} [bits] Bits to add
	 * @returns {BitField} These bits or new BitField if the instance is frozen.
	 */
	add(...bits: BitFieldResolvable<Flags, Type>[]): BitField<Flags, Type> {
		let total = (this.constructor as typeof BitField).DefaultBit as Type;
		for (const bit of bits) {
			// @ts-ignore
			total = (total | (this.constructor as typeof BitField).resolve(bit)) as Type;
		}
		if (Object.isFrozen(this))
			return new (this.constructor as new (
				bits: BitFieldResolvable<Flags, Type>,
			) => BitField<Flags, Type>)((this.bitfield | total) as Type);
		this.bitfield = (this.bitfield | total) as Type;
		return this;
	}

	/**
	 * Removes bits from these.
	 * @param {...BitFieldResolvable} [bits] Bits to remove
	 * @returns {BitField} These bits or new BitField if the instance is frozen.
	 */
	remove(...bits: BitFieldResolvable<Flags, Type>[]): BitField<Flags, Type> {
		let total = (this.constructor as typeof BitField).DefaultBit as Type;
		for (const bit of bits) {
			// @ts-ignore
			total = (total | (this.constructor as typeof BitField).resolve(bit)) as Type;
		}
		if (Object.isFrozen(this))
			return new (this.constructor as new (
				bits: BitFieldResolvable<Flags, Type>,
			) => BitField<Flags, Type>)((this.bitfield & ~total) as Type);
		this.bitfield = (this.bitfield & ~total) as Type;
		return this;
	}

	/**
	 * Gets an object mapping field names to a {@link boolean} indicating whether the
	 * bit is available.
	 * @param {...*} hasParams Additional parameters for the has method, if any
	 * @returns {Object}
	 */
	serialize(...hasParams: readonly unknown[]): Record<Flags, boolean> {
		const serialized: Record<Flags, boolean> = {} as Record<Flags, boolean>;
		for (const [flag, bit] of Object.entries((this.constructor as typeof BitField).Flags)) {
			if (isNaN(Number(flag)))
				// @ts-ignore
				serialized[flag as Flags] = this.has(bit as BitFieldResolvable<Flags, Type>, ...hasParams);
		}
		return serialized;
	}

	/**
	 * Gets an {@link Array} of bitfield names based on the bits available.
	 * @param {...*} hasParams Additional parameters for the has method, if any
	 * @returns {string[]}
	 */
	toArray(...hasParams: readonly unknown[]): Flags[] {
		return [...this[Symbol.iterator](...hasParams)];
	}

	toJSON(): Type extends number ? number : string {
		return (
			typeof this.bitfield === 'number' ? this.bitfield : this.bitfield.toString()
		) as Type extends number ? number : string;
	}

	valueOf(): Type {
		return this.bitfield;
	}

	*[Symbol.iterator](...hasParams: readonly unknown[]): IterableIterator<Flags> {
		for (const bitName of Object.keys((this.constructor as typeof BitField).Flags)) {
			// @ts-ignore
			if (isNaN(Number(bitName)) && this.has(bitName as Flags, ...hasParams)) yield bitName as Flags;
		}
	}

	/**
	 * Resolves bitfields to their numeric form.
	 * @param {BitFieldResolvable} [bit] bit(s) to resolve
	 * @returns {number|bigint}
	 */
	static resolve(bit?: BitFieldResolvable<string, number | bigint>): number | bigint {
		const { DefaultBit } = this;
		if (typeof DefaultBit === typeof bit && (bit as number | bigint) >= DefaultBit)
			return bit as number | bigint;
		if (bit instanceof BitField) return bit.bitfield;
		if (Array.isArray(bit)) {
			return (bit as bigint[])
				.map((bit_) => this.resolve(bit_))
				.reduce((prev, bit_) => (prev as bigint) | (bit_ as bigint), DefaultBit);
		}
		if (typeof bit === 'string') {
			if (!isNaN(Number(bit))) return typeof DefaultBit === 'bigint' ? BigInt(bit) : Number(bit);
			if (this.Flags[bit as keyof typeof this.Flags] !== undefined)
				return this.Flags[bit as keyof typeof this.Flags];
		}
		throw new Error('BitFieldInvalid', { cause: bit });
	}
}
