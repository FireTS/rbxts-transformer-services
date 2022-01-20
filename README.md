# rbxts-transformer-services
This is a [demo transformer](#template) that converts @rbxts/services imports into plain GetService calls for increased legibility.

## Example
```ts
// input.ts
import { Players, ServerScriptService } from "@rbxts/services";

print(Players.LocalPlayer);
print(ServerScriptService.GetChildren().size());
```

```lua
-- output.lua
local Players = game:GetService("Players")
local ServerScriptService = game:GetService("ServerScriptService")
print(Players.LocalPlayer)
print(#ServerScriptService:GetChildren())
```

# Template
This transformer is intended to be used as a template for those who are interested in creating their own transformers in roblox-ts.

A necessary resource for those starting out with transformers is [ts-ast-viewer](https://ts-ast-viewer.com/). It shows you the result of AST, relevant properties, symbol information, type information and it automatically generates factory code for nodes. For example, you can see the code this transformer generates [here](https://ts-ast-viewer.com/#code/MYewdgzgLgBACgGwIYE8CmAnCMC8MDmSAtmgHQDiaUAypgG4CWwaAFAESKqYRsCUANACgYImAHUQGANYQADkma4CxMpRr0mrNhIxQZ85nwDcQA).

I'd also recommend downloading the [TypeScript repo](https://github.com/microsoft/TypeScript) locally as it's extremely helpful when you're using undocumented (the majority of the compiler API), internal or uncommon APIs.

Transformers mutate the TypeScript [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) by replacing parts of the AST with new nodes. Transformers are also able to utilize symbol and type information giving you access to TypeScript's advanced control flow analysis.

## Other Transformers

Here's a list of transformers if you want to see how they handle working with parts of the TypeScript compiler api not shown here (e.g symbols or types).

- [rbxts-transform-debug](https://github.com/roblox-aurora/rbxts-transform-debug) by [@roblox-aurora](https://github.com/roblox-aurora)
- [rbxts-transform-env](https://github.com/roblox-aurora/rbxts-transform-env) by [@roblox-aurora](https://github.com/roblox-aurora)
- [Flamework](https://github.com/rbxts-flamework/transformer) by [@rbxts-flamework](https://github.com/rbxts-flamework)

One other source you may goto for learning about transformers is actually [roblox-ts](https://github.com/roblox-ts/roblox-ts/tree/master/src/TSTransformer) itself. This generates a Luau AST instead of a TS AST but it may still be a useful resource for learning about the compiler api.
