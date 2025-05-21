<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Timestamp from '$lib/components/form/Timestamp.svelte';
	import Mention from '$lib/components/Mention.svelte';
	import Emoji from '$lib/components/message/emoji.svelte';
	import Sticker from '$lib/components/message/sticker.svelte';
	import type { REmoji, RGuild, RRole, RSoundboardSound, RSticker } from '$lib/scripts/RTypes';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import splitByThousand from '$lib/scripts/util/splitByThousands';
	import Sound from './message/sound.svelte';

	let {
		guild,
		roles: raw_roles,
		emojis,
		stickers,
		sounds,
	}: {
		guild: RGuild;
		roles: RRole[];
		emojis: REmoji[];
		stickers: RSticker[];
		sounds: RSoundboardSound[];
	} = $props();

	let roles = $derived(raw_roles);

	beforeNavigate(() => {
		roles = [];
	});

	let presences: number | undefined = $derived(guild.approximate_presence_count);
	let members: number | undefined = $derived(guild.approximate_member_count);
	let interval: null | NodeJS.Timeout = null;

	const formatFeature = (feature: string) => {
		return feature
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const getVerificationLevelText = (level: number): string => {
		const levels = ['None', 'Low', 'Medium', 'High', 'Very High'];
		return levels[level] || 'Unknown';
	};

	const getContentFilterText = (level: number): string => {
		const filters = ['Disabled', 'Members Without Roles', 'All Members'];
		return filters[level] || 'Unknown';
	};

	const getNotificationLevelText = (level: number): string => {
		const notifs = ['All Messages', 'Only Mentions'];
		return notifs[level] || 'Unknown';
	};

	const getMFALevelText = (level: number): string => {
		const mfa = ['None', 'Elevated'];
		return mfa[level] || 'Unknown';
	};

	const getNSFWLevelText = (level: number): string => {
		const nsfw = ['Default', 'Explicit', 'Safe', 'Age Restricted'];
		return nsfw[level] || 'Unknown';
	};

	const getPremiumTierText = (tier: number): string => {
		const tiers = ['None', 'Tier 1', 'Tier 2', 'Tier 3'];
		return tiers[tier] || 'Unknown';
	};

	const getSystemChannelFlags = (flags: number): string[] => {
		const flagDescriptions: { [key: number]: string } = {
			1: 'Suppress join notifications',
			2: 'Suppress premium subscriptions',
			4: 'Suppress guild reminder notifications',
			8: 'Suppress join notification replies',
			16: 'Suppress role subscription purchase notifications',
			32: 'Suppress role subscription purchase notification replies',
		};

		const activeFlags: string[] = [];
		Object.entries(flagDescriptions).forEach(([bitValue, description]) => {
			if (flags & parseInt(bitValue)) {
				activeFlags.push(description);
			}
		});

		return activeFlags.length ? activeFlags : ['None'];
	};

	const getHubTypeText = (type: number | undefined): string => {
		if (type === undefined) return 'None';
		const types = ['Default', 'High School', 'College'];
		return types[type] || 'Unknown';
	};

	$effect(() => {
		if (members && presences) return;

		interval = setInterval(async () => {
			if (members && presences) {
				clearInterval(interval!);
				return;
			}

			const res = await fetch(`/api/guilds/${guild.id}/counts`)
				.then((r) =>
					r.status === 200 ? (r.json() as Promise<{ members: number; online: number }>) : null,
				)
				.catch(() => Promise.resolve(null));
			if (!res) return;

			members = res.members;
			presences = res.online;
		}, 1000);

		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

<div class="flex flex-col w-full h-full of-y-auto of-x-hidden pb-10">
	<section class="flex flex-col gap-5 p-5">
		<div class="bg-main-light rounded-xl p-5">
			{#if guild.discovery_splash_url}
				<img
					src={`${guild.discovery_splash_url}?size=4096`}
					alt=""
					class="w-full rounded-xl h-100 object-cover"
				/>
			{/if}

			{#if guild.icon_url}
				<div class="z-10 ml-5 -mt-15 bg-main-dark p-1 rounded-3xl w-max inline-block">
					<img src={guild.icon_url} alt="" class="rounded-3xl" />
				</div>
			{/if}

			<div class="w-full flex flex-row justify-between items-start pb-5 pt-2">
				<div class="w-50%">
					<div class="flex flex-col justify-center items-start px-5">
						<span class="text-xl font-bold">{guild.name}</span>

						<div class="flex flex-row justify-start items-center gap-5 -ml-1 text-alt-text">
							<span>🟢 {presences ? splitByThousand(presences) : '??.???'} Online</span>
							<span>⚫ {members ? splitByThousand(members) : '??.???'} Members</span>
						</div>

						<div class="flex flex-row text-alt-text">
							<Timestamp time={getTimestampFromID(guild.id)} type="f" />&nbsp; ( <Timestamp
								time={getTimestampFromID(guild.id)}
								type="R"
							/> )
						</div>

						{#if guild.description}
							<p class="text-alt-text mt-4">{guild.description}</p>
						{/if}
					</div>
				</div>
				<div class="w-50% px-5">
					<br />
					<div class="flex flex-col gap-2">
						<div class="flex flex-row items-center gap-2">
							<span class="font-semibold">Owner:</span>
							<Mention type="user" id={guild.owner_id} />
						</div>

						{#if guild.afk_channel_id}
							<div class="flex flex-row items-center gap-2">
								<span class="font-semibold">AFK Channel:</span>
								<Mention type="channel" id={guild.afk_channel_id} {guild} />
								<span class="text-alt-text">({guild.afk_timeout} seconds)</span>
							</div>
						{/if}

						{#if guild.system_channel_id}
							<div class="flex flex-row items-center gap-2">
								<span class="font-semibold">System Channel:</span>
								<Mention type="channel" id={guild.system_channel_id} {guild} />
							</div>
						{/if}

						{#if guild.rules_channel_id}
							<div class="flex flex-row items-center gap-2">
								<span class="font-semibold">Rules Channel:</span>
								<Mention type="channel" id={guild.rules_channel_id} {guild} />
							</div>
						{/if}

						{#if guild.public_updates_channel_id}
							<div class="flex flex-row items-center gap-2">
								<span class="font-semibold">Updates Channel:</span>
								<Mention type="channel" id={guild.public_updates_channel_id} {guild} />
							</div>
						{/if}

						{#if guild.safety_alerts_channel_id}
							<div class="flex flex-row items-center gap-2">
								<span class="font-semibold">Safety Alerts Channel:</span>
								<Mention type="channel" id={guild.safety_alerts_channel_id} {guild} />
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="flex flex-col gap-5 p-5 mx-auto w-full">
		<div class="bg-main-light rounded-xl p-5">
			<h2 class="text-lg font-semibold mb-4">Server Details</h2>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<h3 class="font-semibold">General Settings</h3>
					<div class="ml-4 mt-2 space-y-2">
						<p>
							<span class="font-medium">Verification Level:</span>
							{getVerificationLevelText(guild.verification_level)}
						</p>
						<p>
							<span class="font-medium">Message Notifications:</span>
							{getNotificationLevelText(guild.default_message_notifications)}
						</p>
						<p>
							<span class="font-medium">Content Filter:</span>
							{getContentFilterText(guild.explicit_content_filter)}
						</p>
						<p>
							<span class="font-medium">MFA Requirement:</span>
							{getMFALevelText(guild.mfa_level)}
						</p>
						<p><span class="font-medium">NSFW Level:</span> {getNSFWLevelText(guild.nsfw_level)}</p>
						<p><span class="font-medium">Preferred Locale:</span> {guild.preferred_locale}</p>
						{#if guild.hub_type}
							<p><span class="font-medium">Hub Type:</span> {getHubTypeText(guild.hub_type)}</p>
						{/if}
						{#if guild.owner}
							<p>
								<span class="font-medium">Current User is Owner:</span>
								{guild.owner ? 'Yes' : 'No'}
							</p>
						{/if}
					</div>
				</div>

				<div>
					<h3 class="font-semibold">Statistics</h3>
					<div class="ml-4 mt-2 space-y-2">
						{#if guild.premium_tier !== undefined}
							<p>
								<span class="font-medium">Boost Status:</span>
								{getPremiumTierText(guild.premium_tier)}
								{#if guild.premium_subscription_count}
									<span class="text-alt-text">({guild.premium_subscription_count} boosts)</span>
								{/if}
							</p>
						{/if}
						{#if guild.premium_progress_bar_enabled !== undefined}
							<p>
								<span class="font-medium">Boost Progress Bar:</span>
								{guild.premium_progress_bar_enabled ? 'Enabled' : 'Disabled'}
							</p>
						{/if}
						{#if guild.max_members}
							<p>
								<span class="font-medium">Max Members:</span>
								{splitByThousand(guild.max_members)}
							</p>
						{/if}
						{#if guild.max_presences}
							<p>
								<span class="font-medium">Max Presences:</span>
								{splitByThousand(guild.max_presences)}
							</p>
						{/if}
						{#if guild.max_video_channel_users}
							<p><span class="font-medium">Max Video Users:</span> {guild.max_video_channel_users}</p>
						{/if}
						{#if guild.max_stage_video_channel_users}
							<p>
								<span class="font-medium">Max Stage Users:</span>
								{splitByThousand(guild.max_stage_video_channel_users)}
							</p>
						{/if}
						{#if guild.vanity_url_code}
							<p><span class="font-medium">Vanity URL:</span> discord.gg/{guild.vanity_url_code}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- System Configuration Section -->
		<div class="bg-main-light rounded-xl p-5">
			<h2 class="text-lg font-semibold mb-4">System Configuration</h2>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<h3 class="font-semibold">Widget Settings</h3>
					<div class="ml-4 mt-2 space-y-2">
						{#if guild.widget_enabled !== undefined}
							<p>
								<span class="font-medium">Widget:</span>
								{guild.widget_enabled ? 'Enabled' : 'Disabled'}
							</p>
						{/if}
						{#if guild.widget_channel_id}
							<p class="w-max flex flex-row">
								<span class="font-medium">Widget Channel:</span>
								<Mention type="channel" id={guild.widget_channel_id} {guild} />
							</p>
						{/if}
					</div>

					{#if guild.permissions}
						<h3 class="font-semibold mt-4">Permissions</h3>
						<div class="ml-4 mt-2">
							<p><span class="font-medium">Current User Permissions:</span> {guild.permissions}</p>
						</div>
					{/if}
				</div>

				<div>
					{#if guild.system_channel_flags !== undefined}
						<h3 class="font-semibold">System Channel Configuration</h3>
						<div class="ml-4 mt-2 space-y-2">
							<p><span class="font-medium">Enabled Flags:</span></p>
							<ul class="list-disc ml-8">
								{#each getSystemChannelFlags(guild.system_channel_flags) as flag}
									<li>{flag}</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if guild.application_id}
						<div class="mt-4">
							<p><span class="font-medium">Application ID:</span> {guild.application_id}</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
		{#if guild.features && guild.features.length > 0}
			<div class="bg-main-light rounded-xl p-5">
				<h2 class="text-lg font-semibold mb-4">Server Features</h2>
				<div class="flex flex-wrap gap-2">
					{#each guild.features as feature}
						<div class="bg-main-dark px-3 py-1 rounded-full text-sm">
							{formatFeature(feature)}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if roles && roles.length > 0}
			<div class="bg-main-light rounded-xl p-5">
				<h2 class="text-lg font-semibold mb-4">Roles</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
					{#each roles.sort((a, b) => b.position - a.position) as role}
						<div class="rounded-md line-clamp-1 truncate">
							<Mention type="role" id={role.id} />
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if emojis && emojis.length > 0}
			<div class="bg-main-light rounded-xl p-5">
				<h2 class="text-lg font-semibold mb-4">Custom Emojis</h2>
				<div class="flex flex-wrap gap-3 justify-center items-center">
					{#each emojis.sort((a, b) => a.name!.localeCompare(b.name!)) as emoji}
						<div class="flex flex-col items-center">
							<Emoji animated={emoji.animated || false} id={emoji.id} name={emoji.name!} small={false} />
							<span class="text-xs text-alt-text">{emoji.name}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if stickers && stickers.length > 0}
			<div class="bg-main-light rounded-xl p-5">
				<h2 class="text-lg font-semibold mb-4">Custom Stickers</h2>
				<div class="flex flex-wrap gap-3 justify-center items-center">
					{#each stickers as sticker}
						<div class="flex flex-col items-center">
							<Sticker {sticker} />
							<span class="text-xs text-alt-text">{sticker.name}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if sounds && sounds.length > 0}
			<div class="bg-main-light rounded-xl p-5">
				<h2 class="text-lg font-semibold mb-4">Custom Sounds</h2>
				<div class="flex flex-wrap gap-3 justify-center items-center">
					{#each sounds as sound}
						<Sound {sound} />
					{/each}
				</div>
			</div>
		{/if}

		<div class="flex flex-row gap-5">
			{#if guild.splash}
				<div class="bg-main-light rounded-xl p-5 w-50%">
					<h2 class="text-lg font-semibold mb-4">Server Splash Image</h2>
					<img
						src={`https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.webp?size=4096`}
						alt="Server Splash"
						class="w-full rounded-md"
					/>
				</div>
			{/if}

			{#if guild.banner_url}
				<div class="bg-main-light rounded-xl p-5 w-50%">
					<h2 class="text-lg font-semibold mb-4">Server Banner</h2>
					<img src={`${guild.banner_url}?size=4096`} alt="Server Banner" class="w-full rounded-md" />
				</div>
			{/if}
		</div>

		{#if guild.incidents_data}
			<div class="bg-main-light rounded-xl p-5">
				<h2 class="text-lg font-semibold mb-4">Server Incidents</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#if guild.incidents_data.invites_disabled_until}
						<div class="bg-main-dark p-4 rounded-md">
							<h3 class="text-md font-semibold text-red-400 mb-2">⚠️ Invites Disabled</h3>
							<p class="text-sm">
								Invites are temporarily disabled for this server and will be re-enabled:
							</p>
							<p class="font-medium mt-1">
								<Timestamp
									time={new Date(guild.incidents_data.invites_disabled_until).getTime()}
									type="F"
								/>&nbsp; (<Timestamp
									time={new Date(guild.incidents_data.invites_disabled_until).getTime()}
									type="R"
								/>)
							</p>
						</div>
					{/if}

					{#if guild.incidents_data.dms_disabled_until}
						<div class="bg-main-dark p-4 rounded-md">
							<h3 class="text-md font-semibold text-red-400 mb-2">⚠️ Direct Messages Disabled</h3>
							<p class="text-sm">
								Direct messages are temporarily disabled for this server and will be re-enabled:
							</p>
							<p class="font-medium mt-1">
								<Timestamp
									time={new Date(guild.incidents_data.dms_disabled_until).getTime()}
									type="F"
								/>&nbsp; (<Timestamp
									time={new Date(guild.incidents_data.dms_disabled_until).getTime()}
									type="R"
								/>)
							</p>
						</div>
					{/if}

					{#if guild.incidents_data.dm_spam_detected_at}
						<div class="bg-main-dark p-4 rounded-md">
							<h3 class="text-md font-semibold text-yellow-400 mb-2">⚠️ DM Spam Detected</h3>
							<p class="text-sm">Discord detected spam in direct messages from this server on:</p>
							<p class="font-medium mt-1">
								<Timestamp
									time={new Date(guild.incidents_data.dm_spam_detected_at).getTime()}
									type="F"
								/>&nbsp; (<Timestamp
									time={new Date(guild.incidents_data.dm_spam_detected_at).getTime()}
									type="R"
								/>)
							</p>
						</div>
					{/if}

					{#if guild.incidents_data.raid_detected_at}
						<div class="bg-main-dark p-4 rounded-md">
							<h3 class="text-md font-semibold text-orange-400 mb-2">⚠️ Raid Detected</h3>
							<p class="text-sm">Discord detected a raid on this server on:</p>
							<p class="font-medium mt-1">
								<Timestamp
									time={new Date(guild.incidents_data.raid_detected_at).getTime()}
									type="F"
								/>&nbsp; (<Timestamp
									time={new Date(guild.incidents_data.raid_detected_at).getTime()}
									type="R"
								/>)
							</p>
						</div>
					{/if}

					{#if !guild.incidents_data.invites_disabled_until && !guild.incidents_data.dms_disabled_until && !guild.incidents_data.dm_spam_detected_at && !guild.incidents_data.raid_detected_at}
						<div class="bg-main-dark p-4 rounded-md col-span-2">
							<h3 class="text-md font-semibold text-green-400 mb-2">✅ No Active Incidents</h3>
							<p class="text-sm">
								There are incident records for this server, but no active incidents at this time.
							</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if guild.welcome_screen}
			<div class="bg-main-light rounded-xl p-5">
				<h2 class="text-lg font-semibold mb-4">Welcome Screen</h2>
				{#if guild.welcome_screen.description}
					<p class="mb-4">{guild.welcome_screen.description}</p>
				{/if}
				{#if guild.welcome_screen.welcome_channels && guild.welcome_screen.welcome_channels.length > 0}
					<div class="space-y-2">
						<h3 class="font-semibold">Welcome Channels</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							{#each guild.welcome_screen.welcome_channels as channel}
								<div class="bg-main-dark p-3 rounded-md flex items-center gap-2">
									{#if channel.emoji_id}
										<img
											src={`https://cdn.discordapp.com/emojis/${channel.emoji_id}.webp`}
											alt="Channel Emoji"
											class="w-6 h-6"
										/>
									{:else if channel.emoji_name}
										<span>{channel.emoji_name}</span>
									{/if}
									<div>
										<p class="font-medium">{channel.description}</p>
										<Mention type="channel" id={channel.channel_id} {guild} />
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</section>
</div>
