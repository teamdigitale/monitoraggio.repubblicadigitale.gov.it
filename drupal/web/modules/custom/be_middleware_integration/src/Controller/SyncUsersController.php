<?php

namespace Drupal\be_middleware_integration\Controller;

use Exception;
use Drupal\user\Entity\User;
use Drupal\core\Utility\EnvController;
use Drupal\core\Controller\UserController;
use Drupal\core\Utility\TaxonomyController;
use Drupal\notifications\Controller\NotificationsController;

class SyncUsersController
{
    public static function checkReportUsers(array $userNames)
    {
        $userIds = [];

        $termId = TaxonomyController::createOrGetTermTid('user_roles', EnvController::getValues('USER_ROLE_FOR_NOTIFICATION'));

        foreach ($userNames as $userName) {
            $userId = UserController::load($userName);
            $user = User::load($userId);
            $user->set('field_roles', [$termId]);
            if (!$user->save()) {
                throw new Exception('Error in setting notificaiton user role');
            }
            $userIds[] = $userId;
        }

        $notificationUserIds = NotificationsController::getNotificationUserIds();

        $userIdsToRemove = array_diff($notificationUserIds, $userIds);

        foreach ($userIdsToRemove as $userIdToRemove) {
            $user = User::load($userIdToRemove);
            $user->set('field_roles', []);
            if (!$user->save()) {
                throw new Exception('Error in removing notificaiton user role');
            }
        }

        return [
            "notification_user_ids" => $userIds,
            "removed_user_ids" => $userIdsToRemove
        ];
    }
}
