import type { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';
import s from './styles.module.css';

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  return (
    <Canvas ctx={ctx}>
      <div className={s.configScreen}>
        <h2>Conditional Dates</h2>
        <p>
          This plugin provides a field editor for entering historical or partial dates
          where year, month, and/or day may be unknown.
        </p>

        <h3>How to use</h3>
        <ol>
          <li>Create a <strong>JSON</strong> field on your model.</li>
          <li>In the field's <em>Presentation</em> tab, select <strong>Conditional Date</strong> as the field editor.</li>
        </ol>

        <h3>Stored format</h3>
        <p>The field stores a JSON object with the following structure:</p>
        <pre className={s.code}>{`{
  "year": 1492,
  "month": 10,
  "day": 12,
  "era": "CE",
  "circa": false
}`}</pre>
        <p>
          All components are optional. When no value is set, the field stores <code>null</code>.
        </p>
      </div>
    </Canvas>
  );
}
