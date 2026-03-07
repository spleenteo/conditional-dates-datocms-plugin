import { connect } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import ConditionalDateEditor from "./entrypoints/ConditionalDateEditor";
import { render } from "./utils/render";

const FIELD_EXTENSION_ID = "conditionalDate";

connect({
	manualFieldExtensions() {
		return [
			{
				id: FIELD_EXTENSION_ID,
				name: "Conditional Date",
				type: "editor" as const,
				fieldTypes: ["json"],
			},
		];
	},
	renderFieldExtension(fieldExtensionId, ctx) {
		if (fieldExtensionId === FIELD_EXTENSION_ID) {
			render(<ConditionalDateEditor ctx={ctx} />);
		}
	},
	renderConfigScreen(ctx) {
		return render(<ConfigScreen ctx={ctx} />);
	},
});
