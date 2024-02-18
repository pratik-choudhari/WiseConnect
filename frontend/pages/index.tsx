import { LeftColumn } from "../components/layout/LeftColumn";
import { MainContentColumn } from "../components/layout/MainContentColumn";
import { MainGridLayout } from "../components/layout/MainGridLayout";
import { RightColumn } from "../components/layout/RightColumn";
import { IndexLeftColumn } from "../components/IndexLeftColumn";
import { GetUserId } from "../components/GetUserId";

export default function IndexPage() {
  return (
    <GetUserId>
      <MainGridLayout>
        <LeftColumn>
          <IndexLeftColumn />
        </LeftColumn>

        <MainContentColumn>Middle</MainContentColumn>

        <RightColumn>Right</RightColumn>
      </MainGridLayout>
    </GetUserId>
  );
}
