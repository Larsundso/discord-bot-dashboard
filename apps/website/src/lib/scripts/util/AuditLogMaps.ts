import { AuditLogEvent } from 'discord-api-types/v10';

export const strings = {
	[AuditLogEvent.GuildUpdate]: 'updated the server.',
	[AuditLogEvent.ChannelCreate]: 'created the channel',
	[AuditLogEvent.ChannelUpdate]: 'updated the channel',
	[AuditLogEvent.ChannelDelete]: 'deleted the channel',
	[AuditLogEvent.ChannelOverwriteCreate]: 'created a channel permission overwrite in',
	[AuditLogEvent.ChannelOverwriteUpdate]: 'updated a channel permission overwrite in',
	[AuditLogEvent.ChannelOverwriteDelete]: 'deleted a channel permission overwrite in',
	[AuditLogEvent.MemberKick]: 'kicked the member',
	[AuditLogEvent.MemberPrune]: 'puned members',
	[AuditLogEvent.MemberBanAdd]: 'banned the member',
	[AuditLogEvent.MemberBanRemove]: 'unbanned the member',
	[AuditLogEvent.MemberUpdate]: 'updated the member',
	[AuditLogEvent.MemberRoleUpdate]: 'updated member roles for',
	[AuditLogEvent.MemberMove]: 'moved the member',
	[AuditLogEvent.MemberDisconnect]: 'disconnected the member',
	[AuditLogEvent.BotAdd]: 'added the bot',
	[AuditLogEvent.RoleCreate]: 'created the role',
	[AuditLogEvent.RoleUpdate]: 'updated the role',
	[AuditLogEvent.RoleDelete]: 'deleted the role',
	[AuditLogEvent.InviteCreate]: 'created the invite',
	[AuditLogEvent.InviteUpdate]: 'updated the invite',
	[AuditLogEvent.InviteDelete]: 'deleted the invite',
	[AuditLogEvent.WebhookCreate]: 'created the webhook',
	[AuditLogEvent.WebhookUpdate]: 'updated the webhook',
	[AuditLogEvent.WebhookDelete]: 'deleted the webhook',
	[AuditLogEvent.EmojiCreate]: 'created the emoji',
	[AuditLogEvent.EmojiUpdate]: 'updated the emoji',
	[AuditLogEvent.EmojiDelete]: 'deleted the emoji',
	[AuditLogEvent.MessageDelete]: 'deleted a message from',
	[AuditLogEvent.MessageBulkDelete]: 'bulk deleted messages',
	[AuditLogEvent.MessagePin]: 'pinned a message in',
	[AuditLogEvent.MessageUnpin]: 'unpinned a message in',
	[AuditLogEvent.IntegrationCreate]: 'created the integration',
	[AuditLogEvent.IntegrationUpdate]: 'updated the integration',
	[AuditLogEvent.IntegrationDelete]: 'deleted the integration',
	[AuditLogEvent.StageInstanceCreate]: 'created a stage instance in',
	[AuditLogEvent.StageInstanceUpdate]: 'updated a stage instance in',
	[AuditLogEvent.StageInstanceDelete]: 'deleted a stage instance in',
	[AuditLogEvent.StickerCreate]: 'created the sticker',
	[AuditLogEvent.StickerUpdate]: 'updated the sticker',
	[AuditLogEvent.StickerDelete]: 'deleted the sticker',
	[AuditLogEvent.GuildScheduledEventCreate]: 'created the scheduled event',
	[AuditLogEvent.GuildScheduledEventUpdate]: 'updated the scheduled event',
	[AuditLogEvent.GuildScheduledEventDelete]: 'deleted the scheduled event',
	[AuditLogEvent.ThreadCreate]: 'created the thread',
	[AuditLogEvent.ThreadUpdate]: 'updated the thread',
	[AuditLogEvent.ThreadDelete]: 'deleted the thread',
	[AuditLogEvent.ApplicationCommandPermissionUpdate]:
		'updated the application command permissions of',
	[AuditLogEvent.SoundboardSoundCreate]: 'created the soundboard sound',
	[AuditLogEvent.SoundboardSoundUpdate]: 'updated the soundboard sound',
	[AuditLogEvent.SoundboardSoundDelete]: 'deleted the soundboard sound',
	[AuditLogEvent.AutoModerationRuleCreate]: 'created the auto moderation rule',
	[AuditLogEvent.AutoModerationRuleUpdate]: 'updated the auto moderation rule',
	[AuditLogEvent.AutoModerationRuleDelete]: 'deleted the auto moderation rule',
	[AuditLogEvent.AutoModerationBlockMessage]: '\'s message was blocked by Automod rule',
	[AuditLogEvent.AutoModerationFlagToChannel]: '\'s message was blocked by Automod rule',
	[AuditLogEvent.AutoModerationUserCommunicationDisabled]: 'disabled user communication for',
	[AuditLogEvent.CreatorMonetizationRequestCreated]: 'created a monetization request',
	[AuditLogEvent.CreatorMonetizationTermsAccepted]: 'accepted the monetization terms',
	[AuditLogEvent.OnboardingPromptCreate]: 'created the onboarding prompt',
	[AuditLogEvent.OnboardingPromptUpdate]: 'updated the onboarding prompt',
	[AuditLogEvent.OnboardingPromptDelete]: 'deleted the onboarding prompt',
	[AuditLogEvent.OnboardingCreate]: 'created onboarding',
	[AuditLogEvent.OnboardingUpdate]: 'updated onboarding',
	[AuditLogEvent.HomeSettingsCreate]: 'created home settings',
	[AuditLogEvent.HomeSettingsUpdate]: 'updated home settings',
 146: 'Automod blocked user interaction for'
};

export enum TargetType {
	None = 0,
	Channel = 1,
	Role = 2,
	User = 3,
	Invite = 4,
	Webhook = 5,
	Emoji = 6,
	Message = 7,
	Integration = 8,
	StageInstance = 9,
	Sticker = 10,
	Event = 11,
	Command = 12,
	Sound = 13,
	AutoMod = 14,
	Prompt = 15,
	Onboarding = 16,
	Home = 17,
}

export const targetTypes = {
	[AuditLogEvent.GuildUpdate]: TargetType.None,
	[AuditLogEvent.ChannelCreate]: TargetType.Channel,
	[AuditLogEvent.ChannelUpdate]: TargetType.Channel,
	[AuditLogEvent.ChannelDelete]: TargetType.Channel,
	[AuditLogEvent.ChannelOverwriteCreate]: TargetType.Channel,
	[AuditLogEvent.ChannelOverwriteUpdate]: TargetType.Channel,
	[AuditLogEvent.ChannelOverwriteDelete]: TargetType.Channel,
	[AuditLogEvent.MemberKick]: TargetType.User,
	[AuditLogEvent.MemberPrune]: TargetType.User,
	[AuditLogEvent.MemberBanAdd]: TargetType.User,
	[AuditLogEvent.MemberBanRemove]: TargetType.User,
	[AuditLogEvent.MemberUpdate]: TargetType.User,
	[AuditLogEvent.MemberRoleUpdate]: TargetType.User,
	[AuditLogEvent.MemberMove]: TargetType.User,
	[AuditLogEvent.MemberDisconnect]: TargetType.User,
	[AuditLogEvent.BotAdd]: TargetType.User,
	[AuditLogEvent.RoleCreate]: TargetType.Role,
	[AuditLogEvent.RoleUpdate]: TargetType.Role,
	[AuditLogEvent.RoleDelete]: TargetType.Role,
	[AuditLogEvent.InviteCreate]: TargetType.Invite,
	[AuditLogEvent.InviteUpdate]: TargetType.Invite,
	[AuditLogEvent.InviteDelete]: TargetType.Invite,
	[AuditLogEvent.WebhookCreate]: TargetType.Webhook,
	[AuditLogEvent.WebhookUpdate]: TargetType.Webhook,
	[AuditLogEvent.WebhookDelete]: TargetType.Webhook,
	[AuditLogEvent.EmojiCreate]: TargetType.Emoji,
	[AuditLogEvent.EmojiUpdate]: TargetType.Emoji,
	[AuditLogEvent.EmojiDelete]: TargetType.Emoji,
	[AuditLogEvent.MessageDelete]: TargetType.User,
	[AuditLogEvent.MessageBulkDelete]: TargetType.Message,
	[AuditLogEvent.MessagePin]: TargetType.Message,
	[AuditLogEvent.MessageUnpin]: TargetType.Message,
	[AuditLogEvent.IntegrationCreate]: TargetType.Integration,
	[AuditLogEvent.IntegrationUpdate]: TargetType.Integration,
	[AuditLogEvent.IntegrationDelete]: TargetType.Integration,
	[AuditLogEvent.StageInstanceCreate]: TargetType.StageInstance,
	[AuditLogEvent.StageInstanceUpdate]: TargetType.StageInstance,
	[AuditLogEvent.StageInstanceDelete]: TargetType.StageInstance,
	[AuditLogEvent.StickerCreate]: TargetType.Sticker,
	[AuditLogEvent.StickerUpdate]: TargetType.Sticker,
	[AuditLogEvent.StickerDelete]: TargetType.Sticker,
	[AuditLogEvent.GuildScheduledEventCreate]: TargetType.Event,
	[AuditLogEvent.GuildScheduledEventUpdate]: TargetType.Event,
	[AuditLogEvent.GuildScheduledEventDelete]: TargetType.Event,
	[AuditLogEvent.ThreadCreate]: TargetType.Channel,
	[AuditLogEvent.ThreadUpdate]: TargetType.Channel,
	[AuditLogEvent.ThreadDelete]: TargetType.Channel,
	[AuditLogEvent.ApplicationCommandPermissionUpdate]: TargetType.Command,
	[AuditLogEvent.SoundboardSoundCreate]: TargetType.Sound,
	[AuditLogEvent.SoundboardSoundUpdate]: TargetType.Sound,
	[AuditLogEvent.SoundboardSoundDelete]: TargetType.Sound,
	[AuditLogEvent.AutoModerationRuleCreate]: TargetType.AutoMod,
	[AuditLogEvent.AutoModerationRuleUpdate]: TargetType.AutoMod,
	[AuditLogEvent.AutoModerationRuleDelete]: TargetType.AutoMod,
	[AuditLogEvent.AutoModerationBlockMessage]: TargetType.None,
	[AuditLogEvent.AutoModerationFlagToChannel]: TargetType.None,
	[AuditLogEvent.AutoModerationUserCommunicationDisabled]: TargetType.AutoMod,
	[AuditLogEvent.CreatorMonetizationRequestCreated]: TargetType.None,
	[AuditLogEvent.CreatorMonetizationTermsAccepted]: TargetType.None,
	[AuditLogEvent.OnboardingPromptCreate]: TargetType.Prompt,
	[AuditLogEvent.OnboardingPromptUpdate]: TargetType.Prompt,
	[AuditLogEvent.OnboardingPromptDelete]: TargetType.Prompt,
	[AuditLogEvent.OnboardingCreate]: TargetType.Onboarding,
	[AuditLogEvent.OnboardingUpdate]: TargetType.Onboarding,
	[AuditLogEvent.HomeSettingsCreate]: TargetType.Home,
	[AuditLogEvent.HomeSettingsUpdate]: TargetType.Home,
 146: TargetType.User
};
