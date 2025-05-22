export enum CacheEvents {
 channelCreate = 'channelCreate',
 channelDelete = 'channelDelete',
 channelPinsUpdate = 'channelPinsUpdate',
 channelUpdate = 'channelUpdate',
 emojiCreate = 'emojiCreate',
 emojiDelete = 'emojiDelete',
 emojiUpdate = 'emojiUpdate',
 guildAvailable = 'guildAvailable',
 guildAuditLogEntryCreate = 'guildAuditLogEntryCreate',
 guildCreate = 'guildCreate',
 guildDelete = 'guildDelete',
 guildMemberAdd = 'guildMemberAdd',
 guildMemberRemove = 'guildMemberRemove',
 guildMemberUpdate = 'guildMemberUpdate',
 guildRoleCreate = 'guildRoleCreate',
 guildRoleDelete = 'guildRoleDelete',
 guildRoleUpdate = 'guildRoleUpdate',
 guildScheduledEventCreate = 'guildScheduledEventCreate',
 guildScheduledEventDelete = 'guildScheduledEventDelete',
 guildScheduledEventUpdate = 'guildScheduledEventUpdate',
 guildSoundboardSoundCreate = 'guildSoundboardSoundCreate',
 guildSoundboardSoundDelete = 'guildSoundboardSoundDelete',
 guildSoundboardSoundUpdate = 'guildSoundboardSoundUpdate',
 guildUnavailable = 'guildUnavailable',
 guildUpdate = 'guildUpdate',
 inviteCreate = 'inviteCreate',
 inviteDelete = 'inviteDelete',
 messageCreate = 'messageCreate',
 messageDelete = 'messageDelete',
 messageDeleteBulk = 'messageDeleteBulk',
 messageReactionAdd = 'messageReactionAdd',
 messageReactionRemove = 'messageReactionRemove',
 messageReactionRemoveAll = 'messageReactionRemoveAll',
 messageReactionRemoveEmoji = 'messageReactionRemoveEmoji',
 messageUpdate = 'messageUpdate',
 presenceUpdate = 'presenceUpdate',
 soundboardSounds = 'soundboardSounds',
 stageInstanceCreate = 'stageInstanceCreate',
 stageInstanceDelete = 'stageInstanceDelete',
 stageInstanceUpdate = 'stageInstanceUpdate',
 stickersUpdate = 'stickersUpdate',
 threadCreate = 'threadCreate',
 threadDelete = 'threadDelete',
 threadMembersUpdate = 'threadMembersUpdate',
 threadMemberUpdate = 'threadMemberUpdate',
 threadUpdate = 'threadUpdate',
 typingStart = 'typingStart',
 userUpdate = 'userUpdate',
 voiceStateUpdate = 'voiceStateUpdate',
 webhooksUpdate = 'webhooksUpdate',
}

export enum WebsiteEvents {
 LOGIN = 'login',
 FETCH_GUILD_MEMBERS = 'fetchGuildMembers',
}

export type Message<T extends CacheEvents> = T extends CacheEvents.channelCreate
 ? { id: string; guild_id: string | undefined }
 : T extends CacheEvents.channelDelete
   ? { id: string; guild_id: string | undefined }
   : T extends CacheEvents.channelPinsUpdate
     ? { channel_id: string; guild_id: string | undefined }
     : T extends CacheEvents.channelUpdate
       ? { id: string; guild_id: string | undefined }
       : T extends CacheEvents.emojiCreate
         ? { guild_id: string }
         : T extends CacheEvents.emojiDelete
           ? { guild_id: string }
           : T extends CacheEvents.emojiUpdate
             ? { guild_id: string }
             : T extends CacheEvents.guildAvailable
               ? { id: string }
               : T extends CacheEvents.guildAuditLogEntryCreate
                 ? { id: string; guild_id: string }
                 : T extends CacheEvents.guildCreate
                   ? { id: string }
                   : T extends CacheEvents.guildDelete
                     ? { id: string }
                     : T extends CacheEvents.guildMemberAdd
                       ? { guild_id: string; user_id: string }
                       : T extends CacheEvents.guildMemberRemove
                         ? { guild_id: string; user_id: string }
                         : T extends CacheEvents.guildMemberUpdate
                           ? { guild_id: string; user_id: string }
                           : T extends CacheEvents.guildRoleCreate
                             ? { guild_id: string; role_id: string }
                             : T extends CacheEvents.guildRoleDelete
                               ? { guild_id: string; role_id: string }
                               : T extends CacheEvents.guildRoleUpdate
                                 ? { guild_id: string; role_id: string }
                                 : T extends CacheEvents.guildScheduledEventCreate
                                   ? { guild_id: string; event_id: string }
                                   : T extends CacheEvents.guildScheduledEventDelete
                                     ? { guild_id: string; event_id: string }
                                     : T extends CacheEvents.guildScheduledEventUpdate
                                       ? { guild_id: string; event_id: string }
                                       : T extends CacheEvents.guildSoundboardSoundCreate
                                         ? { guild_id: string; sound_id: string }
                                         : T extends CacheEvents.guildSoundboardSoundDelete
                                           ? { guild_id: string; sound_id: string }
                                           : T extends CacheEvents.guildSoundboardSoundUpdate
                                             ? { guild_id: string; sound_id: string }
                                             : T extends CacheEvents.guildUnavailable
                                               ? { id: string }
                                               : T extends CacheEvents.guildUpdate
                                                 ? { id: string }
                                                 : T extends CacheEvents.inviteCreate
                                                   ? { guild_id: string | undefined; code: string }
                                                   : T extends CacheEvents.inviteDelete
                                                     ? {
                                                        guild_id: string | undefined;
                                                        code: string;
                                                       }
                                                     : T extends CacheEvents.messageCreate
                                                       ? {
                                                          guild_id: string | undefined;
                                                          channel_id: string;
                                                          id: string;
                                                         }
                                                       : T extends CacheEvents.messageDelete
                                                         ? {
                                                            guild_id: string | undefined;
                                                            channel_id: string;
                                                            id: string;
                                                           }
                                                         : T extends CacheEvents.messageDeleteBulk
                                                           ? {
                                                              guild_id: string | undefined;
                                                              channel_id: string;
                                                              ids: string[];
                                                             }
                                                           : T extends CacheEvents.messageReactionAdd
                                                             ? {
                                                                guild_id: string | undefined;
                                                                channel_id: string;
                                                                id: string;
                                                                reaction: string | null;
                                                               }
                                                             : T extends CacheEvents.messageReactionRemove
                                                               ? {
                                                                  guild_id: string | undefined;
                                                                  channel_id: string;
                                                                  id: string;
                                                                  reaction: string | null;
                                                                 }
                                                               : T extends CacheEvents.messageReactionRemoveAll
                                                                 ? {
                                                                    guild_id: string | undefined;
                                                                    channel_id: string;
                                                                    id: string;
                                                                   }
                                                                 : T extends CacheEvents.messageReactionRemoveEmoji
                                                                   ? {
                                                                      guild_id: string | undefined;
                                                                      channel_id: string;
                                                                      id: string;
                                                                      emoji: string | null;
                                                                     }
                                                                   : T extends CacheEvents.messageUpdate
                                                                     ? {
                                                                        guild_id:
                                                                         | string
                                                                         | undefined;
                                                                        channel_id: string;
                                                                        id: string;
                                                                       }
                                                                     : T extends CacheEvents.presenceUpdate
                                                                       ? {
                                                                          guild_id:
                                                                           | string
                                                                           | undefined;
                                                                          user_id: string;
                                                                         }
                                                                       : T extends CacheEvents.soundboardSounds
                                                                         ? { guild_id: string }
                                                                         : T extends CacheEvents.stageInstanceCreate
                                                                           ? {
                                                                              guild_id: string;
                                                                              id: string;
                                                                              channel_id: string;
                                                                             }
                                                                           : T extends CacheEvents.stageInstanceDelete
                                                                             ? {
                                                                                guild_id: string;
                                                                                id: string;
                                                                                channel_id: string;
                                                                               }
                                                                             : T extends CacheEvents.stageInstanceUpdate
                                                                               ? {
                                                                                  guild_id: string;
                                                                                  id: string;
                                                                                  channel_id: string;
                                                                                 }
                                                                               : T extends CacheEvents.stickersUpdate
                                                                                 ? {
                                                                                    guild_id: string;
                                                                                   }
                                                                                 : T extends CacheEvents.threadCreate
                                                                                   ? {
                                                                                      guild_id:
                                                                                       | string
                                                                                       | undefined;
                                                                                      id: string;
                                                                                     }
                                                                                   : T extends CacheEvents.threadDelete
                                                                                     ? {
                                                                                        guild_id:
                                                                                         | string
                                                                                         | undefined;
                                                                                        id: string;
                                                                                       }
                                                                                     : T extends CacheEvents.threadMembersUpdate
                                                                                       ? {
                                                                                          guild_id: string;
                                                                                          id: string;
                                                                                          added?: string[];
                                                                                          removed?: string[];
                                                                                         }
                                                                                       : T extends CacheEvents.threadMemberUpdate
                                                                                         ? {
                                                                                            guild_id: string;
                                                                                            id: string;
                                                                                            user_id: string;
                                                                                           }
                                                                                         : T extends CacheEvents.threadUpdate
                                                                                           ? {
                                                                                              guild_id:
                                                                                               | string
                                                                                               | undefined;
                                                                                              id: string;
                                                                                             }
                                                                                           : T extends CacheEvents.typingStart
                                                                                             ? {
                                                                                                guild_id:
                                                                                                 | string
                                                                                                 | undefined;
                                                                                                channel_id: string;
                                                                                                user_id: string;
                                                                                               }
                                                                                             : T extends CacheEvents.userUpdate
                                                                                               ? {
                                                                                                  id: string;
                                                                                                 }
                                                                                               : T extends CacheEvents.voiceStateUpdate
                                                                                                 ? {
                                                                                                    guild_id:
                                                                                                     | string
                                                                                                     | undefined;
                                                                                                    user_id: string;
                                                                                                   }
                                                                                                 : T extends CacheEvents.webhooksUpdate
                                                                                                   ? {
                                                                                                      guild_id: string;
                                                                                                      channel_id: string;
                                                                                                     }
                                                                                                   : never;
