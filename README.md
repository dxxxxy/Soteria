# Soteria
```
In Greek mythology, Soteria (Ancient Greek: Σωτηρία) was the goddess or spirit (daimon) of safety and salvation, deliverance, and preservation from harm (not to be mistaken for Eleos). Soteria was also an epithet of the goddess Persephone, meaning deliverance and safety.
```
<sup>Wikipedia</sup>

Was your Discord server suddenly deleted? Restore your users roles to what they previously had in the old saved server. Complements the already existing Discord Server Template functionality to perfectly restore the server using webhooks to send messages through.

## [Demo]()
During `--restore`, it remaps the roles of the users of the old server to the new roles in the new server comparing its properties. Duplicate names should not be an issue as long as it is not a 100% replica with the same properties. With `--messages`, it remaps the channels that the old messages came from to the new ones and proceeds to send them with each users username and avatar. SUPPORTS EMBEDS, NOT ATTACHMENTS/FILES.

## Setup
> Create a new server from a template. (save your template link in case you get terminated)
1. Clone this.
2. Install dependencies.
3. Replace the `token` in app.js with your bot token.
4. Run `node .` along with any [Arguments](#arguments) desired.

## Arguments
| Argument | Description |
| --- | --- |
| `--guild` String | The guild id targeted. |
| `--save` | Save users, channels and messages. |
| `--restore` | Remap users to targeted guild. |
| `--messages` | Include messages in save/restore process. |

## Commands
| Command | Description |
| --- | --- |
| `xrr` | Give all non-administrative roles this user had in the saved guild. |