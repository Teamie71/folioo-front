import { BackButton } from '@/components/BackButton';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem] pt-[3.75rem] pb-[6.25rem]'>
        {/* 로고 */}
        <Image src='/MainLogo.svg' alt='MainLogo' width={128} height={32} />

        {/* 개인정보 처리방침 */}
        <div className='flex flex-col gap-[3.125rem]'>
          {/* 헤더 */}
          <div className='flex flex-col gap-[1.25rem]'>
            <div className='flex items-center gap-[1.25rem]'>
              <BackButton />
              <span className='text-[1.5rem] font-bold'>개인정보 처리방침</span>
            </div>

            <p className='w-full border border-[#CDD0D5]' />
          </div>

          {/* 내용 */}
          <div className='flex flex-col gap-[1.25rem] px-[1.25rem]'>
            <div className='flex w-full flex-col gap-[2.5rem]'>
              {/* 서문 */}
              <div className='flex flex-col text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                <p>
                  티미(Teamie) (이하 &quot;회사&quot;)는 회사가 제공하는 Folioo
                  서비스 (이하 &quot;서비스&quot;)를 이용하는 이용자 (이하
                  &quot;이용자&quot; 또는 &quot;정보주체&quot;)의 자유와 권리를
                  보호하기 위해「개인정보 보호법」및 관계 법령이 정한 바를
                  준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고
                  있습니다.
                </p>
                <p>
                  이에「개인정보 보호법」제30조에 따라 이용자에게 개인정보
                  처리에 관한 절차 및 기준을 투명하게 안내하고, 이와 관련한
                  고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과
                  같이 개인정보 처리방침을 수립 및 공개합니다.
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 1조 (개인정보의 처리 목적)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  회사는 다음의 목적을 위하여 개인정보를 처리합니다.
                  <br />
                  처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지
                  않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등
                  필요한 조치를 이행할 예정입니다.
                  <span className='ml-[0.25rem] block'>
                    1. 회원 가입 및 관리
                    <br />
                    {'\u00A0\u00A0'}• 소셜 로그인(OAuth) 연동 본인 확인, 가입
                    의사 확인, 계정 통합 처리, 다중 계정 생성 및 이용권 부정
                    수급 방지, 고객 문의 대응
                    <br />
                    2. 재화 및 서비스 제공
                    <br />
                    {'\u00A0\u00A0'}• 유료 이용권 구매 및 결제 처리, 이용권
                    지급·사용·만료·환불 처리, AI 기반 커리어 지원 서비스 제공
                    <br />
                    3. 서비스 개선 및 통계 분석
                    <br />
                    {'\u00A0\u00A0'}• 서비스 이용 기록 기반의 통계 분석, 신규
                    기능 개발 및 AI 서비스 품질 향상
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 2조 (수집하는 개인정보의 항목)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  <span className='ml-[0.25rem] block'>
                    1. 회원가입 시 필수 수집 항목
                    <br />
                    {'\u00A0\u00A0'}• 성명, 이메일 주소, 로그인타입,
                    로그인식별자, 전화번호
                    <br />
                    2. 서비스 이용 과정에서 자동으로 생성·수집되는 항목
                    <br />
                    {'\u00A0\u00A0'}• IP 주소, 접속 로그, 쿠키, 서비스 이용
                    기록, 기기 정보
                    <br />
                    3. 유료 이용권 결제 시 수집 항목
                    <br />
                    {'\u00A0\u00A0'}• 결제 수단 정보 (PayAPP을 통한 신용카드,
                    계좌번호 등 일부 정보)
                    <br />
                    4. 민감정보 처리 제한
                    <br />
                    {'\u00A0\u00A0'}• 회사는 이용자의 사상·신념, 건강 등에 관한
                    민감정보를 수집하지 않습니다.
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 3조 (개인정보의 처리 및 보유 기간)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                  개인정보를 수집 시에 동의 받은 기간 내에서 개인정보를 처리 및
                  보유합니다.
                  <span className='ml-[0.25rem] block'>
                    1. 원칙적 파기
                    <br />
                    {'\u00A0\u00A0'}• 회원 탈퇴 시 이름, 이메일 주소, 로그인
                    식별자 등 기본 식별 정보는 지체 없이 영구 파기됩니다.
                    <br />
                    2. 부정이용 방지를 위한 전화번호 보관
                    <br />
                    {'\u00A0\u00A0'}• 무료 이용권 중복 수급, 다중 계정 생성 등
                    서비스 부정 이용 방지를 위하여 회원 탈퇴일로부터 1년간
                    전화번호를 암호화하여 보관한 후 파기합
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'}니다.
                    <br />
                    3. 이용권 거래 내역 보관
                    <br />
                    {'\u00A0\u00A0'}• 「전자상거래 등에서의 소비자보호에 관한
                    법률」에 따라, 모든 이용권에 대한 거래 내역 (구매, 지급,
                    사용, 만료, 환불 등에 관한 기록)은 5년간
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'}보관됩니다.
                    <br />
                    4. AI 생성 데이터의 분리 보관
                    <br />
                    {'\u00A0\u00A0'}• 이용 메타데이터와, 서비스 내 AI를 사용하는
                    기능 사용 시 입력 및 생성된 데이터 결과물은 회원 탈퇴 시
                    계정(User ID)과의 연결이 영구적으로
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'}해제되며, 특정 개인을
                    식별할 수 없는 데이터 상태로 서비스 품질 향상을 위해 영구
                    보관됩니다.
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 4조 (개인정보의 제 3자 제공 및 처리 위탁)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  <span className='ml-[0.25rem] block'>
                    1. 개인정보 처리 위탁
                    <br />
                    회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리
                    업무를 외부에 위탁하고 있습니다.
                    <br />
                    {'\u00A0\u00A0'}• 서버 및 데이터 보관: Amazon Web Services
                    (AWS)
                    <br />
                    {'\u00A0\u00A0'}• 결제 처리 (PG): PayAPP (페이앱)
                    <br />
                    {'\u00A0\u00A0'}• AI 텍스트 및 이미지 처리: OpenAI (※ 전송된
                    데이터는 AI 모델 학습용으로 사용되지 않습니다.)
                    <br />
                    {'\u00A0\u00A0'}• 서비스 이용 기록 기반의 통계 분석, 신규
                    기능 개발 및 AI 서비스 품질 향상
                    <br />
                    2. 개인정보의 제3자 제공
                    <br />
                    회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지
                    않습니다. 단, 다음의 경우에는 예외로 합니다.
                    <br />
                    {'\u00A0\u00A0'}• 이용자가 사전에 동의한 경우
                    <br />
                    {'\u00A0\u00A0'}• 법령의 규정에 따른 경우 또는 수사 목적으로
                    법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 5조 (정보주체의 권리, 의무 및 행사방법)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  정보주체는 언제든지 본인의 개인정보 열람, 정정,
                  삭제(회원탈퇴)를 요구할 수 있습니다. 탈퇴 시 제3조에 명시된
                  보관 정보를 제외한 개인 식별
                  <br />
                  정보는 복구 불가능한 방법으로 파기됩니다.
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 6조 (개인정보 보호책임자 및 담당자 연락처)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  회사는 개인정보 처리에 관한 업무를 총괄하여 책임지는 개인정보
                  보호책임자를 지정하고 있습니다.
                  <span className='ml-[0.25rem] block'>
                    {'\u00A0\u00A0'}• 개인정보 보호책임자: 김수빈
                    <br />
                    {'\u00A0\u00A0'}• 소속/ 직위: 티미(Teamie)/ 대표
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 7조 (개인정보처리방침의 효력 및 변경)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  <span className='ml-[0.25rem] block'>
                    1. 본 방침은 2026년 3월 9일부터 적용됩니다.
                    <br />
                    2. 법령·정책·서비스 변경에 따라 내용이 변경될 경우, 변경
                    사유 및 시행일자를 명시하여 사전 공지합니다.
                  </span>
                </p>
              </div>

              {/* 제 7조 (개인정보처리방침의 효력 및 변경) */}
              <div className='flex flex-col gap-[1.25rem]'>
                <div className='text-[1.125rem] font-bold text-[#1A1A1A]'></div>
                <div className='flex flex-col gap-[1.25rem] px-[0.25rem] text-[1rem] leading-[150%] text-[#464B53]'>
                  <div className='flex flex-col gap-[0.75rem]'>
                    <p></p>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
