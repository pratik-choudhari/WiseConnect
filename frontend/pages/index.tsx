import { LeftColumn } from "../components/layout/LeftColumn";
import { MainContentColumn } from "../components/layout/MainContentColumn";
import { MainGridLayout } from "../components/layout/MainGridLayout";
import { RightColumn } from "../components/layout/RightColumn";

export default function IndexPage() {
  return (
    <MainGridLayout>
      <LeftColumn>Left</LeftColumn>

      <MainContentColumn>Middle</MainContentColumn>

      <RightColumn>Right</RightColumn>
    </MainGridLayout>
  );
}
