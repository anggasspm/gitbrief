export type Lang = 'en' | 'id'

export const dictionary = {
  en: {
    recentCommits:      'Recent Commits',
    pullRequests:        'Pull Requests',
    mergedPullRequests:  'Merged Pull Requests',
    noCommits:           'No commits found.',
    noPullRequests:      'No pull requests found.',
    noMergedPullRequests:'No merged pull requests yet.',
    tabAll:              'All',
    tabCommits:          'Commits',
    tabPrs:              'PRs',
    tabMerges:           'Merges',
    back:                'Back',
    viewOnGithub:        'View on GitHub',
    commitExplanation:   'Commit explanation',
    diff:                'Diff',
    cached:              'Cached',
    loading:             'Loading…',
    generating:          'Analyzing changes…',
  },
  id: {
    recentCommits:      'Commit Terbaru',
    pullRequests:        'Pull Request',
    mergedPullRequests:  'Pull Request Tergabung',
    noCommits:           'Tidak ada commit ditemukan.',
    noPullRequests:      'Tidak ada pull request ditemukan.',
    noMergedPullRequests:'Belum ada pull request yang digabung.',
    tabAll:              'Semua',
    tabCommits:          'Commit',
    tabPrs:              'PR',
    tabMerges:           'Gabungan',
    back:                'Kembali',
    viewOnGithub:        'Lihat di GitHub',
    commitExplanation:   'Penjelasan commit',
    diff:                'Perubahan',
    cached:              'Tersimpan',
    loading:             'Memuat…',
    generating:          'Menganalisis perubahan…',
  },
} as const

export function t(lang: Lang, key: keyof typeof dictionary.en): string {
  return dictionary[lang][key] ?? dictionary.en[key]
}