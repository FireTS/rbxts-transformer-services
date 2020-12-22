# rbxts-transformer-services
This is a simple transformer that converts @rbxts/services imports into plain GetService calls.
This improves the legibility of the emitted lua, and potentially has a slight performance boost since you don't have to import the actual module.
