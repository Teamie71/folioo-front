import { BackButton } from '@/components/BackButton';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function TOSPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem] pt-[3.75rem] pb-[6.25rem]'>
        {/* 로고 */}
        <Image src='/MainLogo.svg' alt='MainLogo' width={128} height={32} />

        {/* 서비스 이용 약관 */}
        <div className='flex flex-col gap-[3.125rem]'>
          {/* 헤더 */}
          <div className='flex flex-col gap-[1.25rem]'>
            <div className='flex items-center gap-[1.25rem]'>
              <BackButton />
              <span className='text-[1.5rem] font-bold'>
                Folioo 서비스 이용 약관
              </span>
            </div>

            <p className='w-full border border-[#CDD0D5]' />
          </div>

          {/* 내용 */}
          <div className='flex flex-col gap-[1.25rem] px-[1.25rem]'>
            <div className='flex w-full flex-col gap-[2.5rem] rounded-[1.75rem]'>
              {/* 제 1조 (목적) */}
              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 1조 (목적) <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  본 약관은 티미(Teamie) (이하 &quot;회사&quot;)가 제공하는
                  Folioo 서비스 (이하 &quot;서비스&quot;)의 이용 조건, 절차,
                  회원의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 2조 (용어의 정의) <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  본 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.{' '}
                  <br />
                  <div className='ml-[0.25rem]'>
                    1. &quot;이용권&quot;이란 회원이 서비스 내의 특정 기능을
                    이용할 수 있도록 회사가 발행하는 무형의 재화를 말합니다.{' '}
                    <br />
                    2. &quot;유료 이용권&quot;이란 회원이 비용을 지불하고 구매한
                    이용권을 말하며, &quot;무료 이용권&quot;이란 회사가 이벤트를
                    통해 무상으로 지급한 이용권을 말합{' '}
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'}
                    니다.
                  </div>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 3조 (이용권의 소진 순서 및 유효기간) <br />
                <p className='font-regular ml-[0.25rem] text-[1.125rem] leading-[150%]'>
                  1. 소진 순서
                  <br />
                  {'\u00A0\u00A0'}
                  • 회원이 서비스를 이용하여 이용권이 차감될 때, 유료 및 무료
                  여부와 관계없이 계정에 부여된 일자가 가장 빠른 이용권부터 우선
                  차감됩니다.
                  <br />
                  2. 유효기간
                  <br />
                  {'\u00A0\u00A0'}• 모든 이용권 (유료 및 무료 포함)의 유효기간은
                  획득일로부터 6개월입니다. 유효기간이 경과한 이용권은 자동
                  소멸하며, 복구되거나 환불하지
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0\u00A0'}않습니다.
                  <br />
                  3. 예외 사항
                  <br />
                  {'\u00A0\u00A0'}• 단, Open Beta Test 등 특정 이벤트 기간에
                  &apos;매주 초기화&apos; 조건으로 지급된 무료 이용권은 해당
                  이벤트의 자체소멸 규칙을 우선하여 따릅니다.
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 4조 (청약철회 및 환불 정책)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  회사는「전자상거래 등에서의 소비자보호에 관한 법률」 및
                  「콘텐츠이용자보호지침」에 따라 아래와 같은 환불 규정을
                  적용합니다.
                  <br />
                  <div className='ml-[0.25rem]'>
                    1. 전액 환불 (청약 철회)
                    <br />
                    {'\u00A0\u00A0'}
                    • 회원은 유료 이용권 결제일로부터 7일 이내에, 구매한
                    이용권을 단 1회도 사용하지 않은 상태에 한하여 100% 결제 취소
                    및 전액 환불을 요청할 수 있습니다.
                    <br />
                    2. 부분 환불
                    <br />
                    {'\u00A0\u00A0'}
                    • 결제일로부터 7일이 경과하였거나, 구매한 유료 이용권을 1회
                    이상 사용한 이력이 있는 경우 아래의 산정식에 따라 부분
                    환불이 진행됩니다.
                    <br />
                    {'\u00A0\u00A0'}
                    • 최종 환불 금액 = 총 결제 금액 - (사용 횟수 x 1회 이용권
                    정상가) - 위약금 (총 결제 금액의 10%)
                    <br />
                    3. 부분 환불 유의사항 및 &apos;1회 정상가&apos;의 기준
                    <br />
                    {'\u00A0\u00A0'}• 위 산정식에서 &apos;1회 이용권
                    정상가&apos;라 함은 서비스 내 결제 화면에 명시된 해당 기능의
                    &quot;할인이 적용되지 않은 2회권 가격의 50%&quot;에 해당하는
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0'} 금액을 의미합니다. (예: 묶음/
                    할인 프로모션을 통해 5회권을 구매한 후 부분 환불 시에도,
                    이미 사용한 횟수는 할인가가 아닌 본 항에서 정의한
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'}1회 정상가를 기준으로
                    차감됩니다.)
                    <br />
                    {'\u00A0\u00A0'}
                    • 산정식에 따른 공제 금액이 총 결제 금액을 초과하여 산출
                    결과가 0원 이하일 경우, 환불 가능한 금액은 0원으로 처리되며
                    회사는 회원에게 추가
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'}금액을 청구하지 않습니다.
                    <br />
                    {'\u00A0\u00A0'}
                    • 최종 환불 금액은 회원의 환불 요청 접수 후 담당자의 확인 및
                    정산 절차를 거쳐 확정됩니다.
                    <br />
                    {'\u00A0\u00A0'}
                    • 무료 이용권은 어떠한 경우에도 환불 대상이 아닙니다.
                    <br />
                    4. 부정이용에 따른 조치
                    <br />
                    {'\u00A0\u00A0'}• 회원이 타인의 결제 정보를 도용하거나, 다중
                    계정 생성 등 부정한 방법으로 이용권을 무상 취득 및 사용하는
                    경우, 회사는 사전 통보 없이 해당
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'}이용권을 전량 회수하고
                    서비스 이용을 영구 정지할 수 있으며 관련 결제건은 환불되지
                    않습니다.
                  </div>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 5조 (AI 서비스의 한계 및 면책 조항)
                <br />
                <p className='font-regular ml-[0.25rem] text-[1.125rem] leading-[150%]'>
                  1. 회사가 제공하는 서비스는 외부 인공지능 모델을 기반으로
                  결과물을 분석 및 생성합니다. 기술적 한계로 인해 생성된
                  결과물에는 사실과 다르거
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0'}나, 부정확하거나, 편향된 내용
                  (환각 현상 등)이 포함될 수 있습니다.
                  <br />
                  2. 회사가 제공하는 결과물은 커리어 준비를 위한 참고용
                  자료입니다. 이를 실제 포트폴리오 제출, 취업, 이직, 면접 등에
                  활용하기 전 최종적인 내용
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0'}검토 및 사실관계 확인의 책임은
                  전적으로 회원 본인에게 있습니다.
                  <br />
                  3. 회사는 회원이 서비스의 결과물을 활용하여 발생한 서류 심사
                  탈락, 취업 실패, 기타 직·간접적인 불이익 및 손해에 대하여
                  일체의 법적 책임을
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0'}지지 않습니다.
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 6조 (서비스의 중단 및 책임 제한)
                <br />
                <p className='font-regular ml-[0.25rem] text-[1.125rem] leading-[150%]'>
                  1. 회사는 정기 점검, 외부 API의 연동 장애, 클라우드 서버 오류,
                  통신 장애 등 불가피한 사유가 발생한 경우 서비스 제공을
                  일시적으로 중단할 수
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0'}있습니다.
                  <br />
                  2. 제 1항에 따른 일시적인 서비스 중단은 원칙적으로 유료
                  이용권의 청약철회 및 부분 환불의 사유가 되지 않습니다. 단,
                  사전 공지 없이 회사의 명
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0'}백한 귀책사유로 인하여 서비스
                  중단이 연속하여 4시간 이상 발생한 경우, 회사는 장애 시간에
                  상응하여 이용권의 유효기간을 연장하는 방식으
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0'}로 보상하며 현금 환불을 진행하지
                  않습니다.
                  <br />
                  3. 회사는 무료로 제공되는 서비스 (무료 이용권 포함)의 이용과
                  관련하여 회원에게 발생한 손해 및 서비스 중단에 대해서는 어떠한
                  법적 책임도 지
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0'}지 않습니다.
                  <br />
                  4. 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지, 제휴
                  업체의 일방적인 정책 변경 및 API 장애 등 회사의 통제 범위를
                  벗어난 불가항력적
                  <br />
                  {'\u00A0\u00A0\u00A0\u00A0'}사유로 인하여 서비스를 제공할 수
                  없는 경우에는 그 책임이 면제됩니다.
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 7조 (약관의 효력 및 변경)
                <br />
                <p className='font-regular ml-[0.25rem] text-[1.125rem] leading-[150%]'>
                  1. 본 약관은 2026년 3월 9일부터 적용됩니다.
                  <br />
                  2. 법령·정책·서비스 변경에 따라 내용이 변경될 경우, 변경 사유
                  및 시행일자를 명시하여 사전 공지합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
