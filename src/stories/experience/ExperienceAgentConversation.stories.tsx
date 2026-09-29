import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ExperienceListAgentPanel } from '@/features/experience/list/components/ExperienceListAgentPanel';
import { useExperienceListStore } from '@/store/useExperienceListStore';

const meta = {
  title: 'Experience/Agent/Conversation',
  component: ExperienceListAgentPanel,
  parameters: { layout: 'centered' },
  beforeEach: () => {
    const previous = useExperienceListStore.getState();
    useExperienceListStore.setState({
      agentOpen: true,
      groups: [{ id: 'preview-group', name: '2026', isUnclassified: false }],
      experiences: [
        {
          id: 'preview',
          name: '새로운 활동 1',
          groupId: 'preview-group',
          blocks: [],
        },
      ],
      selection: { kind: 'experience', id: 'preview' },
    });
    return () => useExperienceListStore.setState(previous);
  },
  decorators: [
    (Story) => (
      <div className='h-[800px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExperienceListAgentPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Working: Story = {
  args: {
    conversations: {
      preview: {
        messages: [
          {
            id: '1',
            role: 'user',
            content: '고객 문의를 분석하고 안내 문구를 개선했어.',
          },
        ],
        isWorking: true,
      },
    },
  },
};
export const LongMessage: Story = {
  args: {
    conversations: {
      preview: {
        messages: [
          {
            id: '1',
            role: 'user',
            content: '긴문장'.repeat(100) + '\n줄바꿈도 그대로 표시해줘.',
          },
        ],
        isWorking: true,
      },
    },
  },
};
export const Idle: Story = {
  args: {
    conversations: {
      preview: {
        messages: [{ id: '1', role: 'user', content: '고객 문의를 분석했어.' }],
        isWorking: false,
      },
    },
  },
};

const successContent =
  '내용을 분석하여 경험을 정리했어요.\n• 문제해결 아래 1개의 블록 수정\n• 담당업무 아래 2개의 블록 생성';
export const Success: Story = {
  args: {
    conversations: {
      preview: {
        messages: [
          { id: 'user', role: 'user', content: '고객 문의를 분석했어.' },
          {
            id: 'success',
            role: 'assistant',
            content: successContent,
            onRevert: async () => {
              // Storybook에서만 이전 블록 상태 복원을 모사한다.
              useExperienceListStore.setState((state) => ({
                experiences: state.experiences.map((item) =>
                  item.id === 'preview' ? { ...item, blocks: [] } : item,
                ),
              }));
            },
          },
        ],
      },
    },
  },
};
export const Reverted: Story = {
  args: {
    conversations: {
      preview: {
        messages: [
          {
            id: 'success',
            role: 'assistant',
            content: successContent,
            reverted: true,
          },
        ],
      },
    },
  },
};
export const RevertFailed: Story = {
  args: {
    conversations: {
      preview: {
        messages: [
          {
            id: 'success',
            role: 'assistant',
            content: successContent,
            onRevert: async () => {
              throw new Error('Preview failure');
            },
          },
        ],
      },
    },
  },
};

export const Failed: Story = {
  args: {
    dailyChatCount: 7,
    conversations: {
      preview: {
        messages: [
          {
            id: 'user',
            role: 'user',
            content: '이 자기소개서에서 사용한 소재를 경험으로 정리해줘.',
            attachment: { name: '자기소개서.pdf', size: 1258291 },
          },
        ],
        failure: {
          nodeId: 'analyze',
          onRetry: async (nodeId) => {
            if (nodeId !== 'analyze') throw new Error('wrong node');
            throw new Error('Preview: retry failed');
          },
        },
      },
    },
  },
};
export const LimitReached: Story = { args: { dailyChatCount: 10 } };
export const BeforeLimitDisplay: Story = { args: { dailyChatCount: 6 } };
