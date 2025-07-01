import { SchemaComposer } from "graphql-compose";
import { UserGPQLMutations, UserGPQLQueries } from "@modules/users";
import { CrewGPQLMutations, CrewGPQLQueries } from "@modules/crews";

// Initialize the schema composer
const schemaComposer = new SchemaComposer();

// Add queries and mutations to the schema composer
schemaComposer.Query.addFields({ ...UserGPQLQueries, ...CrewGPQLQueries });
schemaComposer.Mutation.addFields({
	...UserGPQLMutations,
	...CrewGPQLMutations,
});

export { schemaComposer };
