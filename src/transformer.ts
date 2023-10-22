import ts from "typescript";

/**
 * This is the transformer's configuration, the values are passed from the tsconfig.
 */
export interface TransformerConfig {
	_: void;
}

/**
 * This is a utility object to pass around your dependencies.
 *
 * You can also use this object to store state, e.g prereqs.
 */
export class TransformContext {
	public factory: ts.NodeFactory;

	constructor(
		public program: ts.Program,
		public context: ts.TransformationContext,
		public config: TransformerConfig,
	) {
		this.factory = context.factory;
	}

	/**
	 * Transforms the children of the specified node.
	 */
	transform<T extends ts.Node>(node: T): T {
		return ts.visitEachChild(node, (node) => visitNode(this, node), this.context);
	}
}

function visitImportDeclaration(context: TransformContext, node: ts.ImportDeclaration) {
	const { factory } = context;

	const path = node.moduleSpecifier;
	const clause = node.importClause;
	if (!clause) return node;
	if (!ts.isStringLiteral(path)) return node;
	if (path.text !== "@rbxts/services") return node;

	const namedBindings = clause.namedBindings;
	if (!namedBindings) return node;
	if (!ts.isNamedImports(namedBindings)) return node;

	return [
		// We replace the import declaration instead of stripping it to prevent
		// issues with isolated modules.
		factory.updateImportDeclaration(
			node,
			undefined,
			factory.createImportClause(false, undefined, factory.createNamedImports([])),
			node.moduleSpecifier,
			undefined,
		),

		// Creates a multi-variable statement as shown below.
		//
		// const Players = game.GetService("Players"),
		//		Workspace = game.GetService("Workspace");
		factory.createVariableStatement(
			undefined,
			factory.createVariableDeclarationList(
				namedBindings.elements.map((specifier) => {
					const serviceName = specifier.propertyName ? specifier.propertyName.text : specifier.name.text;
					const variableName = specifier.name;

					return factory.createVariableDeclaration(
						variableName,
						undefined,
						undefined,
						factory.createCallExpression(
							factory.createPropertyAccessExpression(factory.createIdentifier("game"), "GetService"),
							undefined,
							[factory.createStringLiteral(serviceName)],
						),
					);
				}),
				ts.NodeFlags.Const,
			),
		),
	];
}

function visitStatement(context: TransformContext, node: ts.Statement): ts.Statement | ts.Statement[] {
	// This is used to transform statements.
	// TypeScript allows you to return multiple statements here.

	if (ts.isImportDeclaration(node)) {
		// We have encountered an import declaration,
		// so we should transform it using a separate function.

		return visitImportDeclaration(context, node);
	}

	return context.transform(node);
}

function visitExpression(context: TransformContext, node: ts.Expression): ts.Expression {
	// This can be used to transform expressions
	// For example, a call expression for macros.

	return context.transform(node);
}

function visitNode(context: TransformContext, node: ts.Node): ts.Node | ts.Node[] {
	if (ts.isStatement(node)) {
		return visitStatement(context, node);
	} else if (ts.isExpression(node)) {
		return visitExpression(context, node);
	}

	// We encountered a node that we don't handle above,
	// but we should keep iterating the AST in case we find something we want to transform.
	return context.transform(node);
}
