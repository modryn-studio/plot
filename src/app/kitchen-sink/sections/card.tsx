import { Card } from '@/components/ui/card';
import { Row, Section } from '../_components/section';

export function CardSection() {
  return (
    <Section
      id="card"
      title="Card"
      intro="The one raised surface: a lighter ground plus a shadow, and no hairline. A drawn edge and a cast shadow are two claims about the same object, and running both is why a bordered-and-shadowed card always looks slightly cheap. Buttons keep their edge on purpose (see Button): a card is a region you read, a button is a thing you hit, and an edge is how a hit target says where it ends."
    >
      <Row label="On the page" note="bg-elevated + shadow-card, no border">
        <Card className="max-w-sm p-6">
          <p className="text-h3">A raised object</p>
          <p className="text-body text-muted mt-2 text-pretty">
            Elevated is lighter than the page in both modes, so the lift comes from the ground
            changing, not from an outline. Check this in dark mode: it still lifts.
          </p>
        </Card>
      </Row>

      <Row label="The hairline still exists" note="inside the object, not around it: border-rule">
        <Card className="max-w-sm">
          {/* border-rule, NOT border-border: this line separates two rows, it does not bound a
              control, and rule is a deliberately softer weight. See the token's own comment. */}
          <div className="border-rule border-b p-4">
            <p className="text-body">A row</p>
          </div>
          <div className="border-rule border-b p-4">
            <p className="text-body">Another row</p>
          </div>
          <div className="p-4">
            <p className="text-body">The last row carries no divider</p>
          </div>
        </Card>
      </Row>
    </Section>
  );
}
