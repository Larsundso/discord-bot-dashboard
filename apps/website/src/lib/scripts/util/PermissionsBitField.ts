import { PermissionFlagsBits } from 'discord-api-types/v10';
import { BitField, type BitFieldResolvable } from './BitField';

export type PermissionsString = keyof typeof PermissionFlagsBits;
export type PermissionResolvable = BitFieldResolvable<keyof typeof PermissionFlagsBits, bigint>;

/**
 * Data structure that makes it easy to interact with a permission bitfield. All {@link GuildMember}s have a set of
 * permissions in their guild, and each channel in the guild may also have {@link PermissionOverwrites} for the member
 * that override their default permissions.
 * @extends {BitField}
 */
export class PermissionsBitField extends BitField<PermissionsString, bigint> {
	/**
	 * Numeric permission flags.
	 * @type {PermissionFlagsBits}
	 * @memberof PermissionsBitField
	 * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
	 */
	static Flags = PermissionFlagsBits;

	/**
	 * Bitfield representing every permission combined
	 * @type {bigint}
	 * @memberof PermissionsBitField
	 */
	static All = Object.values(PermissionFlagsBits).reduce((all, p) => all | p, 0n);

	/**
	 * Bitfield representing the default permissions for users
	 * @type {bigint}
	 * @memberof PermissionsBitField
	 */
	static Default = BigInt(104324673);

	/**
	 * Bitfield representing the permissions required for moderators of stage channels
	 * @type {bigint}
	 * @memberof PermissionsBitField
	 */
	static StageModerator =
		PermissionFlagsBits.ManageChannels |
		PermissionFlagsBits.MuteMembers |
		PermissionFlagsBits.MoveMembers;

	/**
	 * @type {bigint}
	 * @memberof PermissionsBitField
	 * @private
	 */
	static DefaultBit = BigInt(0);

	/**
	 * Bitfield of the packed bits
	 * @type {bigint}
	 * @name PermissionsBitField#bitfield
	 */

	/**
	 * Data that can be resolved to give a permission number. This can be:
	 * * A string (see {@link PermissionsBitField.Flags})
	 * * A permission number
	 * * An instance of {@link PermissionsBitField}
	 * * An Array of PermissionResolvable
	 * @typedef {string|bigint|PermissionsBitField|PermissionResolvable[]} PermissionResolvable
	 */

	/**
	 * Gets all given bits that are missing from the bitfield.
	 * @param {BitFieldResolvable} bits Bit(s) to check for
	 * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
	 * @returns {string[]}
	 */
	missing(bits: BitFieldResolvable<PermissionsString, bigint>, checkAdmin: boolean = true) {
		return checkAdmin && this.has(PermissionFlagsBits.Administrator) ? [] : super.missing(bits);
	}

	/**
	 * Checks whether the bitfield has a permission, or any of multiple permissions.
	 * @param {PermissionResolvable} permission Permission(s) to check for
	 * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
	 * @returns {boolean}
	 */
	any(permission: PermissionResolvable, checkAdmin: boolean = true): boolean {
		return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.any(permission);
	}

	/**
	 * Checks whether the bitfield has a permission, or multiple permissions.
	 * @param {PermissionResolvable} permission Permission(s) to check for
	 * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
	 * @returns {boolean}
	 */
	has(permission: PermissionResolvable, checkAdmin: boolean = true): boolean {
		return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.has(permission);
	}

	/**
	 * Gets an {@link Array} of bitfield names based on the permissions available.
	 * @returns {string[]}
	 */
	toArray() {
		return super.toArray(false);
	}
}
