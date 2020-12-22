# rbxts-transformer-services
This is a simple transformer that converts @rbxts/services imports into plain GetService calls.
This improves the legibility of the emitted lua, and potentially has a slight performance boost since you don't have to import the actual module.


## Example
The following code will convert into the lua code below it.
```ts
import { Players, ServerScriptService } from "@rbxts/services";

print(Players.LocalPlayer);
print(ServerScriptService.GetChildren().size());
```

```lua
local Players = game:GetService("Players")
local ServerScriptService = game:GetService("ServerScriptService")
print(Players.LocalPlayer)
print(#ServerScriptService:GetChildren())
```
