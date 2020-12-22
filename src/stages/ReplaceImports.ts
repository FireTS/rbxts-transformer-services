import ts from "byots";
import { Stage } from "../Context";

export class ReplaceImports extends Stage<ts.ImportDeclaration> {
	wants(node: ts.Node): node is ts.ImportDeclaration {
		return ts.isImportDeclaration(node);
	}

	visit(node: ts.ImportDeclaration): ts.Node | ts.Node[] {
		const factory = this.factory;
		const path = node.moduleSpecifier;
		if (ts.isStringLiteral(path)) {
			if (path.text === "@rbxts/services") {
				const importClause = node.importClause;
				if (importClause && importClause.namedBindings) {
					if (ts.isNamedImports(importClause.namedBindings)) {
						const newVariables: ts.Node[] = [];
						for (const element of importClause.namedBindings.elements) {
							const serviceName = element.propertyName ? element.propertyName.text : element.name.text;
							const variableName = element.name.text;

							newVariables.push(
								factory.createVariableStatement(
									undefined,
									factory.createVariableDeclarationList(
										[
											factory.createVariableDeclaration(
												factory.createIdentifier(variableName),
												undefined,
												undefined,
												factory.createCallExpression(
													factory.createPropertyAccessExpression(
														factory.createIdentifier("game"),
														factory.createIdentifier("GetService"),
													),
													undefined,
													[factory.createStringLiteral(serviceName)],
												),
											),
										],
										ts.NodeFlags.Const,
									),
								),
							);
						}
						return newVariables;
					}
				}
			}
		}
		return node;
	}
}
