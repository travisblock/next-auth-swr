import ContentLoader from "react-content-loader"

export const SingleSkeleton = props => (
    <ContentLoader 
    speed={2}
    style={{ width: "100%", height: "100%" }}
    viewBox="0 0 300 20"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    uniqueKey="single-skeleton"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="300" height="20" />
  </ContentLoader>
)